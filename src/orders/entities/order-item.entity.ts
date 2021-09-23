import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish, DishOption } from "src/sharemusles/entities/dish.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@InputType('OrderItemOptionInput', {isAbstract: true})
@ObjectType()
export class OrderItemOption{
    @Field(() => String)
    name: string;

    @Field(() => String, {nullable: true})
    choice: String;
}

@InputType('OrderItemInput', {isAbstract: true})
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity{
    @Field(() => Dish)
    @ManyToOne(() => Dish, {nullable: true, onDelete: "CASCADE"})
    dish: Dish;

    @Field(() => [OrderItemOption], {nullable: true})
    @Column({type: "json", nullable: true})
    options?: OrderItemOption[];
}