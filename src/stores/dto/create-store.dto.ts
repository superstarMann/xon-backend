import { ArgsType, Field } from "@nestjs/graphql";
import {IsBoolean, IsString, Length, } from 'class-validator'

@ArgsType()
export class CreateStoreDto {
    @Field(type => String)
    @IsString()
    name: string;

    @Field(type => Boolean)
    @IsBoolean()
    isVegan: boolean;
  
    @Field(type => String)
    @IsString()
    address: string;
  
    @Field(type => String)
    @Length(2, 5)
    ownersName: string;
}