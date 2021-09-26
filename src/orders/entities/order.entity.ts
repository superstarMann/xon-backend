import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsNumber } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish } from "src/sharemusles/entities/dish.entity";
import { ShareMusle } from "src/sharemusles/entities/sharemusle.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus{
    Pending = 'Pending', //대기
    Going = 'Going', //가는중
    Protecting = 'Protecting', //지킴이
    Arrived = 'Arrived'//도착
}

registerEnumType(OrderStatus, {name: 'OrderStatus'});

@InputType('OrderInputType',{isAbstract: true})
@ObjectType()
@Entity()
export class Order extends CoreEntity{

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.orders, {onDelete:'SET NULL', nullable: true, eager: true})
    customer?: User;

    @RelationId((order: Order) => order.customer)
    customerId: number;    

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.rides, {onDelete: 'SET NULL', nullable: true, eager: true})
    driver?: User;

    @RelationId((order: Order) => order.driver)
    driverId: number
    
    @Field(() => ShareMusle, {nullable: true})
    @ManyToOne(() => ShareMusle, shareMusle => shareMusle.orders, {onDelete: 'SET NULL', nullable: true, eager: true})
    shareMusle?: ShareMusle;

    @Field(() => [OrderItem])
    @ManyToMany(() => OrderItem, {eager: true})
    @JoinTable()
    items: OrderItem[];

    @Field(() => Float, {nullable: true})
    @Column({nullable: true})
    @IsNumber()
    total?: number;

    @Field(() => OrderStatus)
    @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.Pending})
    @IsEnum(OrderStatus)
    status: OrderStatus

}