import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { ShareMusle } from "../entities/sharemusle.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class ShareMuslesInput extends PaginationInput{}

@ObjectType()
export class ShareMuslesOutput extends PaginationOutput{
    @Field(() => [ShareMusle], {nullable: true})
    results?: ShareMusle[]
}