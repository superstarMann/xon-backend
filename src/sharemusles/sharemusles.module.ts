import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { ShareMusle } from './entities/sharemusle.entity';
import { CountryResolver, DishResolver, ShareMusleResolver} from './sharemusles.resolver';
import { CountryRepository } from './repositories/country.repository';
import { ShareMusleService } from './sharemusles.service';

@Module({
  imports:[TypeOrmModule.forFeature([ShareMusle, CountryRepository, Dish])],
  providers: [ShareMusleResolver, CountryResolver, DishResolver, ShareMusleService]
})
export class ShareMuslesModule {}
