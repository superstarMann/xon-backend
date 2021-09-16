import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guader } from './entities/guader.entity';
import { CountryResolver, GuaderResolver } from './guaders.resolver';
import { GuaderService } from './guaders.service';
import { CountryRepository } from './repositories/country.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Guader, CountryRepository])],
  providers: [GuaderResolver, CountryResolver ,GuaderService]
})
export class GuadersModule {}
