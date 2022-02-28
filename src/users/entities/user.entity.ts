import { InternalServerErrorException } from "@nestjs/common";
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt'
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { ShareMusle } from "src/sharemusles/entities/sharemusle.entity";
import { Order } from "src/orders/entities/order.entity";
import { CountrySelect } from "./countryselect.entity";

export enum UserRole {
  User = 'User',
  Guader = 'Guader'
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType',{ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({unique: true})
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(type => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'enum', enum: CountrySelect , nullable: true})
  @Field(type => CountrySelect, {nullable: true})
  @IsEnum(CountrySelect)
  countrySelect: CountrySelect;

  @Column({ default: false })
  @Field(type => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field(() => [ShareMusle])
  @OneToMany(() => ShareMusle, sharemusle => sharemusle.owner)
  sharemusles: ShareMusle[]

  @Field(() => [Order])
  @OneToMany(() => Order, order => order.customer)
  orders: Order[]

  @Field(() => [Order])
  @OneToMany(() => Order, order => order.driver)
  rides: Order[]


  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}