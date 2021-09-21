import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Dish } from "../entities/dish.entity";

@InputType()
export class DeleteDishInput {
    @Field(()=> Number)
    dishId: number
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {}