import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { ShareMusle } from "./sharemusle.entity";

@InputType('CountryInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Country extends CoreEntity{
    @Field(() => String)
    @Column({unique: true})
    @IsString()
    name: string

    @Field(type => String, {nullable: true} )
    @Column({nullable: true})
    @IsString()
    coverImg: string;

    @Field(() => String)
    @Column({unique: true})
    @IsString()
    slug: string 

    @Field(() => [ShareMusle], {nullable: true})
    @OneToMany(() => ShareMusle, sharemusle => sharemusle.country)
    shareMusles: ShareMusle[] 
}