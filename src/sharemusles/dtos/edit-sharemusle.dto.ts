import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { CreateShareMusleInput } from "./create-sharemusle.dto";


@InputType()
export class EditShareMusleInput extends PartialType(CreateShareMusleInput) {
    @Field(() => Number)
    sharemusleId: number
}

@ObjectType()
export class EditShareMusleOutput extends CoreOutput{}