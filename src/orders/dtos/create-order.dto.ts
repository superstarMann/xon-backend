import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { OrderItemOption } from "../entities/order-item.entity";


@InputType()
export class CreateOrderItemInput {
    @Field(() => Number)
    dishId: number;

    @Field(() => [OrderItemOption], {nullable: true})
    options?: OrderItemOption[]
}

@InputType()
export class CreateOrderInput{
    @Field(() => Number)
    shareMusleId: number;

    @Field(() => [CreateOrderItemInput])
    items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput{}