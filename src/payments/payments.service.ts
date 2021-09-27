import { Injectable } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ShareMusle } from 'src/sharemusles/entities/sharemusle.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/create-payment.dto';
import { GetPaymentOutput } from './dtos/get-payment.dto';
import { Payment } from './entities/Payments';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment) 
        private readonly payments: Repository<Payment>,
        @InjectRepository(ShareMusle)
        private readonly shareMusles: Repository<ShareMusle>,
        private schedulerRegistry: SchedulerRegistry
    ){}

    async createPayment(owner: User, {transactionId, shareMusleId}: CreatePaymentInput): Promise<CreatePaymentOutput>{
        try{
            const shareMusle = await this.shareMusles.findOne(shareMusleId);
            if(!shareMusle){
                return{
                    ok: false,
                    error:`ShareMusle Not Found`
                };
            }
            if(shareMusle.ownerId !== owner.id){
                return{
                    ok: false,
                    error: `You are not allowed to do this.`
                };
            }
            shareMusle.isPromoted = true;
            const date = new Date()
            date.setDate(date.getDate() +7); //promotedUntil 기간
            shareMusle.promotedUntil = date
            this.shareMusles.save(shareMusle);
            await this.payments.save(this.payments.create({
                transactionId,
                user: owner,
                shareMusle
            }))
            return{
                ok: true
            }
        }catch(error){
            return {
                ok: false,
                error: `Could Not Create Payment`
            };
        }
    };

    async getPayments(user:User):Promise<GetPaymentOutput>{
        try{
            const payments = await this.payments.find({user: user});
            return{
                ok: true,
                payments
            };
        }catch(error){
            return{
                ok: false,
                error: `Could Not Load Payments`
            };
        }
    };
}
