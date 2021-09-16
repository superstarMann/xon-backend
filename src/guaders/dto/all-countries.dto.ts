import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Country } from "../entities/country.entity";

@ObjectType()
export class AllCountriesOutput extends CoreOutput{
    @Field(() => [Country], {nullable: true})
    countries?: Country[]
}