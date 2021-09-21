import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { EditShareMusleInput } from "./edit-sharemusle.dto";

@InputType()
export class DeleteShareMusleInput {
    @Field(() => Number)
    shareMusleId: number
}

@ObjectType()
export class DeleteShareMusleOutput extends CoreOutput{}