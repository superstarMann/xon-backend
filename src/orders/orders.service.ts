import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { NEW_GOING_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from 'src/jwt/jwt.constants';
import { Dish } from 'src/sharemusles/entities/dish.entity';
import { ShareMusle } from 'src/sharemusles/entities/sharemusle.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOuput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutPut } from './dtos/get-orders.dto';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) 
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(ShareMusle)
        private readonly shareMusles: Repository<ShareMusle>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        @Inject(PUB_SUB)
        private readonly pubsub: PubSub
    ){}

    async createOrder(
        customer: User,
        {shareMusleId, items}: CreateOrderInput): Promise<CreateOrderOutput>{
        try{
            const shareMusle = await this.shareMusles.findOne(shareMusleId);
            if(!shareMusle){
                return{
                    ok: false,
                    error: `ShareMusle Not Found`
                };
            }
            let orderFinalPrice = 0;
            const orderItems: OrderItem[] = [];
            for (const item of items) { //forEach 에서는 return {ok~ 안됨}
                const dish = await this.dishes.findOne(item.dishId);
                if(!dish){
                    return{
                        ok: false,
                        error: 'Dish Not Found'
                    };
                }
                let dishFinalPrice = dish.price;
            for (const itemOption of item.options) {
              const dishOption = dish.options.find(
                dishOption => dishOption.name === itemOption.name,
              );
              if (dishOption) {
                if (dishOption.extra) {
                  dishFinalPrice = dishFinalPrice + dishOption.extra;
                } else {
                  const dishOptionChoice = dishOption.choices.find(
                    optionChoice => optionChoice.name === itemOption.choice,
                  );
                  if (dishOptionChoice) {
                    if (dishOptionChoice.extra) {
                      dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                    }
                  }
                }
              }
            }
            orderFinalPrice = orderFinalPrice + dishFinalPrice;
            const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        dish, 
                        options: item.options
                    }),
                );
                orderItems.push(orderItem);
            }
            const order = await this.orders.save(this.orders.create({
                customer,
                shareMusle,
                total: orderFinalPrice,
                items: orderItems
            }),
        );
        await this.pubsub.publish(NEW_PENDING_ORDER, {pendingOrders:{order, ownerId: shareMusle.ownerId}})
        return{
            ok: true
         };
        }catch(error){
            return{
                ok: false,
                error: `Could Not Create Order`
            };
        }
    };

    async getOrders(
      user: User,
      {status}:GetOrdersInput):Promise<GetOrdersOutPut>{
        try{
          let orders: Order[];
          if(user.role === UserRole.User){
            orders = await this.orders.find({
              where: {
                customer: user,
                ...(status && {status})
              },
            });
          }
          else if(user.role ===  UserRole.Guader){
            orders = await this.orders.find({
              where:{
                driver: user, //warining
                ...(status && {status})
              },
            });
            const shareMusles = await this.shareMusles.find({
              where:{
                owner: user
              },
              relations:['orders']
            });
            orders = shareMusles.map(shareMusle => shareMusle.orders).flat(1)
            if(status){
              orders = orders.filter(order => order.status === status);
            }
          }
          return{
            ok: true,
            orders
          }
        }catch(error){
          return{
            ok:false,
            error:`Could Not Get Orders`
          }
        }
      };

    canSeeOrder(user: User, order: Order): boolean{
      let canSee = true;
        if(user.role === UserRole.User && order.customerId !== user.id){
          canSee = false;
        }
        if(user.role === UserRole.Guader && order.shareMusle.ownerId !== user.id){
          canSee = false;
        }
        return canSee
    };

    async getOrder(
      user: User,
      {id: orderId}: GetOrderInput
    ):Promise<GetOrderOuput>{
      try{
        const order = await this.orders.findOne(orderId, {relations: ['shareMusle']});
        if(!order){
          return{
            ok: false,
            error: `Order Not Found`
          };
        }
        if(!this.canSeeOrder(user, order)){
          return{
            ok: false,
            error: `You Can't See That`
          };
        }
        return{
          ok: true,
          order
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Get Order`
        }
      }
    };

    async editOrder(
      user: User,
      {id: orderId, status}: EditOrderInput
    ):Promise<EditOrderOutput>{
      try{
        const order = await this.orders.findOne(orderId);
        if(!order){
          return{
            ok: false,
            error: `Order Not Found`
          };
        }
        if(!this.canSeeOrder(user, order)){
          return {
            ok: false,
            error: `Can't See That`
          };
        }
        let canEdit = true;
        if(user.role === UserRole.User){
          canEdit = false;
        }
        if(!canEdit){
          return{
            ok: false,
            error: `You Can't Edit That`
          };
        }
        await this.orders.save({
          id: orderId,
          status
        });
        const newOrder = {...order, status}
          if(user.role === UserRole.Guader){
            if(status === OrderStatus.Going){
              await this.pubsub.publish(NEW_GOING_ORDER, {goingOrders: newOrder})
            }
          }
          await this.pubsub.publish(NEW_ORDER_UPDATE, {updateOrders: newOrder})
        return{
          ok: true,
          order
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Edit Order`
        }
      }
    };

    async takeOrder(driver: User, {id: orderId}: TakeOrderInput): Promise<TakeOrderOutput>{
      try{
        const order = await this.orders.findOne(orderId);
        if(!order){
          return{
            ok: false,
            error: `Order Not Found`
          };
        }
        await this.orders.save({
          id: orderId,
          driver
        })
        await this.pubsub.publish(NEW_ORDER_UPDATE, {updateOrders: {...order, driver}})
        return{
          ok: true
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Take Order`
        };
      }
    }

}
