import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish } from "src/sharemusles/entities/dish.entity";
import { ShareMusle } from "src/sharemusles/entities/sharemusle.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

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
    @ManyToOne(() => User, user => user.orders, {onDelete:'SET NULL', nullable: true})
    customer?: User;

    @Field(() => User, {nullable: true})
    @ManyToOne(() => User, user => user.rides, {onDelete: 'SET NULL', nullable: true})
    driver?: User;
    
    @Field(() => ShareMusle, {nullable: true})
    @ManyToOne(() => ShareMusle, shareMusle => shareMusle.orders, {onDelete: 'SET NULL', nullable: true})
    shareMusle: ShareMusle;

    @Field(() => [Dish])
    @ManyToMany(() => Dish)
    @JoinTable()
    dishes: Dish[];

    @Field(() => Float)
    @Column()
    total: number;

    @Field(() => OrderStatus)
    @Column({type: 'enum', enum: OrderStatus})
    status: OrderStatus

}