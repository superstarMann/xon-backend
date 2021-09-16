import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { EditGuaderInput } from "./edit-guader.dto";

@InputType()
export class DeleteGuaderInput {
    @Field(() => Number)
    guaderId: number
}

@ObjectType()
export class DeleteGuaderOutput extends CoreOutput{}