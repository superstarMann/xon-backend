import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId} from "typeorm";
import { Country } from "./country.entity";
import { Dish } from "./dish.entity";

@InputType('GuaderInputType',{isAbstract: true})
@ObjectType()
@Entity()
export class ShareMusle extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    name: string;
  
    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(() => String)
    @Column()
    @IsString()
    coverImg: string

    @Field(() => Country, {nullable: true})
    @ManyToOne(() => Country, country => country.shareMusles, {nullable: true, onDelete: 'SET NULL'})
    country: Country

    @Field(() => User)
    @ManyToOne(() => User, user => user.sharemusles, {onDelete: 'CASCADE'})
    owner: User

    @RelationId((shareMusle: ShareMusle) => shareMusle.owner)
    ownerId: number

    @Field(() => [Dish])
    @OneToMany(()=> Dish, dish => dish.shareMusle)
    menu: Dish[];

    @Field(() => [Order])
    @OneToMany(() => Order, order => order.shareMusle)
    orders: Order[]

}