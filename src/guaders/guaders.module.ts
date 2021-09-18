import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Guader } from './entities/guader.entity';
import { CountryResolver, DishResolver, GuaderResolver } from './guaders.resolver';
import { GuaderService } from './guaders.service';
import { CountryRepository } from './repositories/country.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Guader, CountryRepository, Dish])],
  providers: [GuaderResolver, CountryResolver, DishResolver, GuaderService]
})
export class GuadersModule {}
