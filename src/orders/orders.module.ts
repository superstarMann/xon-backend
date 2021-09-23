import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ShareMusle } from 'src/sharemusles/entities/sharemusle.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from 'src/sharemusles/entities/dish.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order, ShareMusle, OrderItem, Dish])],
  providers: [OrderService, OrderResolver]
})
export class OrdersModule {}
