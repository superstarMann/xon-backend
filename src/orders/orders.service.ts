import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/sharemusles/entities/dish.entity';
import { ShareMusle } from 'src/sharemusles/entities/sharemusle.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

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
        private readonly dishes: Repository<Dish>
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
            await this.orders.save(this.orders.create({
                customer,
                shareMusle,
                total: orderFinalPrice,
                items: orderItems
            }),
        );
        return{
            ok: true
         };
        }catch(error){
            return{
                ok: false,
                error: `Could Not Create Order`
            };
        }
    }

}
