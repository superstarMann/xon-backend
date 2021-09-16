import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne} from "typeorm";
import { Country } from "./country.entity";

@InputType('GuaderInputType',{isAbstract: true})
@ObjectType()
@Entity()
export class Guader extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    name: string;
  
    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(() => String)
    @Column()
    @IsString()
    coverImg: string

    @Field(() => Country, {nullable: true})
    @ManyToOne(() => Country, country => country.guaders, {nullable: true, onDelete: 'SET NULL'})
    country: Country

    @Field(() => User)
    @ManyToOne(() => User, user => user.guaders, {onDelete: 'CASCADE'})
    owner: User
}