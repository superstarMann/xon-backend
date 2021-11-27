import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { ShareMusle } from "./sharemusle.entity";

@InputType('DishChoiceInputType', {isAbstract: true})
@ObjectType()
export class DishChoice{
    @Field(() => String)
    name: string;

    @Field(() => Number, {nullable: true})
    extra?: number
}

@InputType('DishOptionInputType', {isAbstract: true})
@ObjectType()
export class DishOption {
    @Field(() => String)
    name: string;

    @Field(() => [DishChoice], {nullable :true})
    choices?: DishChoice[]

    @Field(() => Number ,{nullable :true})
    extra?: number;
}

@InputType('DishInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(() => String)
    @Column()
    @IsString()
    name: string;

    @Field(() => Number)
    @Column()
    @IsNumber()
    price: number;

    @Field(() => String, {nullable: true})
    @Column({nullable: true})
    @IsString()
    photo?: string;

    @Field(() => String)
    @Column()
    @IsString()
    description: string;

    @Field(() => ShareMusle, {nullable: true})
    @ManyToOne( () => ShareMusle, shareMusle => shareMusle.menu, {onDelete :'CASCADE'})
    shareMusle: ShareMusle;
    
    @RelationId((dish: Dish) => dish.shareMusle)
    shareMusleId: number
    
    @Field(() => [DishOption], {nullable: true}) //small entity instead
    @Column({type: 'json', nullable: true})
    options?: DishOption[]

    @Field(() => Order, {nullable: true})
    @ManyToOne(() => Order, order => order.dishName, {nullable: true})
    orderName: Order

    @RelationId((dish: Dish) => dish.orderName)
    orderNameId: number
}