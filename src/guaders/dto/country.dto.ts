import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Country } from "../entities/country.entity";
import { Guader } from "../entities/guader.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class CountryInput extends PaginationInput {
    @Field(() => String)
    slug: string;
}

@ObjectType()
export class CountryOutput extends PaginationOutput{
    @Field(() => [Guader], {nullable: true})
    guaders?: Guader[];

    @Field(() => Country, {nullable: true})
    country?: Country
}