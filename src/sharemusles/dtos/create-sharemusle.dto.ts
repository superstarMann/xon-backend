import {Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { ShareMusle } from "../entities/sharemusle.entity";


@InputType()
export class CreateShareMusleInput extends PickType(ShareMusle, ['address', 'name', 'coverImg']){
    @Field(() => String)
    countryName: string;
}


@ObjectType()
export class CreateShareMusleOutput extends CoreOutput{
    @Field(() => Number)
    shareMusleId?: number;
}