import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { ShareMusle } from "../entities/sharemusle.entity";

@InputType()
export class ShareMusleInput {
    @Field(() => Number)
    shareMusleId: number
}

@ObjectType()
export class ShareMusleOutput extends CoreOutput{
    @Field(() => ShareMusle, {nullable: true})
    shareMusle?: ShareMusle

}