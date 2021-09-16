import {Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Guader } from "../entities/guader.entity";


@InputType()
export class CreateGuaderInput extends PickType(Guader, ['address', 'name', 'coverImg']){
    @Field(() => String)
    countryName: string;
}


@ObjectType()
export class CreateGuaderOutput extends CoreOutput{}