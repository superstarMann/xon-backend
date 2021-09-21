import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { ShareMusle } from "../entities/sharemusle.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class SearchShareMusleInput extends PaginationInput {
    @Field(() => String)
    query: string;
}

@ObjectType()
export class SearchShareMusleOutput extends PaginationOutput{
    @Field(() => [ShareMusle], {nullable: true})
    shareMusles?: ShareMusle[]
}