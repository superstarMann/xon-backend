import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { ShareMusle } from "../entities/sharemusle.entity";

@ObjectType()
export class MyShareMuslesOutput extends CoreOutput{
    @Field(() => [ShareMusle])
    shareMusles?: ShareMusle[];
}