import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareMusle } from 'src/sharemusles/entities/sharemusle.entity';
import { Payment } from './entities/Payments';
import { PaymentResolver } from './payments.resolver';
import { PaymentService } from './payments.service';

@Module({
  imports:[TypeOrmModule.forFeature([Payment, ShareMusle])],
  providers: [PaymentResolver, PaymentService]
})
export class PaymentModule {}
