import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Guader } from './entities/guader.entity';
import { GuaderResolver } from './guaders.resolver';
import { GuaderService } from './guaders.service';

@Module({
  imports:[TypeOrmModule.forFeature([Guader, Country])],
  providers: [GuaderResolver, GuaderService]
})
export class GuadersModule {}
