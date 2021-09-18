import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Guader } from "../entities/guader.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class SearchGuaderInput extends PaginationInput {
    @Field(() => String)
    query: string;
}

@ObjectType()
export class SearchGuaderOutput extends PaginationOutput{
    @Field(() => [Guader], {nullable: true})
    guaders?: Guader[]
}