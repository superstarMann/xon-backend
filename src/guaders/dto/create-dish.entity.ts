import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Dish } from "../entities/dish.entity";

@InputType()
export class CreateDishInput extends PickType(Dish, ['name', 'photo','price', 'description','options']){
    @Field(() => Number)
    guaderId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput{}