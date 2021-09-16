import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { CreateGuaderInput } from "./create-guader.dto";

@InputType()
export class EditGuaderInput extends PartialType(CreateGuaderInput) {
    @Field(() => Number)
    guaderId: number
}

@ObjectType()
export class EditGuaderOutput extends CoreOutput{}