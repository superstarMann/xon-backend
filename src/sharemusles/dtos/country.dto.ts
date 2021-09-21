import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Country } from "../entities/country.entity";
import { ShareMusle } from "../entities/sharemusle.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class CountryInput extends PaginationInput {
    @Field(() => String)
    slug: string;
}

@ObjectType()
export class CountryOutput extends PaginationOutput{
    @Field(() => [ShareMusle], {nullable: true})
    shareMusles?: ShareMusle[];

    @Field(() => Country, {nullable: true})
    country?: Country
}