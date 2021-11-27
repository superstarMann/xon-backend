import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { ShareMusle } from "../entities/sharemusle.entity";

@InputType()
export class MyShareMusleInput extends PickType(ShareMusle, ['id']){}

@ObjectType()
export class MyShareMusleOutput extends CoreOutput{
    @Field(() => ShareMusle, {nullable: true})
    shareMusle?: ShareMusle;
}