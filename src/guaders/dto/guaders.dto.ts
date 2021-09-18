import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Guader } from "../entities/guader.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class GuadersInput extends PaginationInput{}

@ObjectType()
export class GuadersOutput extends PaginationOutput{
    @Field(() => [Guader], {nullable: true})
    results?: Guader[]
}