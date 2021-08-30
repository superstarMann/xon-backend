import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    @Field(() => Number)
    @IsNumber()
    id:number

    @Field(type => String)
    @Column()
    @IsString()
    name: string;

    @Field(type => Boolean, {nullable: true})
    @Column({default: true})
    @IsOptional()
    @IsString()
    isVegan: boolean;
  
    @Field(type => String)
    @Column()
    @IsString()
    address: string;
}