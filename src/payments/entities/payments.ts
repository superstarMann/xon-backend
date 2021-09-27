import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { ShareMusle } from "src/sharemusles/entities/sharemusle.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";

@InputType('PaymentInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Payment extends CoreEntity{
    @Field(() => String, {nullable: true})
    @Column()
    transactionId: string

    @Field(() => User)
    @ManyToOne(() => User, user => user.payments)
    user: User

    @RelationId((payment: Payment) => payment.user)
    userId: number
    
    @Field(() => ShareMusle)
    @ManyToOne(() => ShareMusle) //Many to one은 oneTomany 굳이 안써도 됨 단 반대인 경우는 절대 안됨
    shareMusle: ShareMusle;

    @RelationId((payment: Payment) => payment.shareMusle)
    @Field(() => Number)
    shareMusleId: number
}