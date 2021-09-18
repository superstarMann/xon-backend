import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Guader } from "../entities/guader.entity";

@InputType()
export class GuaderInput {
    @Field(() => Number)
    guaderId: number
}

@ObjectType()
export class GuaderOutput extends CoreOutput{
    @Field(() => Guader, {nullable: true})
    guader?: Guader

}