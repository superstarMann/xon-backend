import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { NEW_GOING_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from 'src/jwt/jwt.constants';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOuput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutPut } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';
import { PubSub } from 'graphql-subscriptions';
import { UpdateOrderInput } from './dtos/updates-order.dto';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';
import { DeleteOrderInput, DeleteOrderOutput } from './dtos/delete-order.dto';

@Resolver(() => Order)
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub,
    ){}

    @Mutation(() => CreateOrderOutput)
    @Role(['User'])
    createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput : CreateOrderInput
    ): Promise<CreateOrderOutput>{
        return this.orderService.createOrder(customer, createOrderInput);
    };
    

    @Query(() => GetOrdersOutPut)
    @Role(['Any'])
    getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInput
    ):Promise<GetOrdersOutPut>{
        return this.orderService.getOrders(user, getOrdersInput)
    };

    @Query(() => GetOrderOuput)
    @Role(['Any'])
    getOrder(
        @AuthUser() user: User,
        @Args('input') getOrderInput :GetOrderInput
    ):Promise<GetOrderOuput>{
        return this.orderService.getOrder(user, getOrderInput)
    }
    
    @Mutation(() => EditOrderOutput)
    @Role(['Any'])
    editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput :EditOrderInput
    ):Promise<EditOrderOutput>{
        return this.orderService.editOrder(user, editOrderInput)
    };

    @Subscription(() => Order, {
        filter: ({pendingOrders: {ownerId}}, _, {user}) =>{ //must boolean
            return ownerId === user.id
        },
        resolve: ({pendingOrders: {order}}) => order
    })
    @Role(['Guader'])
    pendingOrders(){
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER)
    }

    @Subscription(() => Order)
    @Role(['Guader'])
    goingOrders(){
        return this.pubSub.asyncIterator(NEW_GOING_ORDER)
    }

    @Subscription(() => Order,{
        filter: (
            {updateOrders: order}: {updateOrders: Order}, 
            {input}: {input: UpdateOrderInput}, 
            {user}: {user: User}
            )=>{
            if(
                order.customerId !== user.id &&
                order.shareMusle.ownerId !== user.id &&
                order.driverId !== user.id
            ){
                return false
            }
            return order.id === input.id
        }
    })
    @Role(['Any'])
    updateOrders(@Args('input') updateOrderInput : UpdateOrderInput){
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE);
    }

    @Mutation(() => TakeOrderOutput)
    @Role(['Guader'])
    takeOrder(
        @AuthUser() driver: User,
        @Args('input')
        takeOrderInput: TakeOrderInput
    ):Promise<TakeOrderOutput>{
        return this.orderService.takeOrder(driver, takeOrderInput)
    }

    @Mutation(() => DeleteOrderOutput)
    @Role(['Any'])
    deleteOrder(
        @Args('input') deleteOrderInput: DeleteOrderInput
    ):Promise<DeleteOrderOutput>{
        return this.orderService.deleteOrder(deleteOrderInput)
    }

}
