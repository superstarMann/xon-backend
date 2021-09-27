import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/create-payment.dto';
import { GetPaymentOutput } from './dtos/get-payment.dto';
import { Payment } from './entities/Payments';
import { PaymentService } from './payments.service';

@Resolver(() => Payment)
export class PaymentResolver {
    constructor(
        private readonly paymentService: PaymentService
    ){}

    @Mutation(() => CreatePaymentOutput)
    @Role(['Guader'])
    createPayment(
        @AuthUser() owner: User,
        @Args('input') createPaymentInput: CreatePaymentInput
    ):Promise<CreatePaymentOutput>{
        return this.paymentService.createPayment(owner, createPaymentInput)
    }

    @Query(() => GetPaymentOutput)
    @Role(['Guader'])
    getPayments(
        @AuthUser() user: User
    ):Promise<GetPaymentOutput>{
        return this.paymentService.getPayments(user)
    }
}
