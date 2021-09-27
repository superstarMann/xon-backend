import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Payment } from "../entities/Payments";

@InputType()
export class CreatePaymentInput extends PickType(Payment, ['shareMusleId', 'transactionId']){}

@ObjectType()
export class CreatePaymentOutput extends CoreOutput{}