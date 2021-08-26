import { Module } from '@nestjs/common';
import { StoresResolver } from './stores.resolver';
import { StoresService } from './stores.service';

@Module({
  providers: [StoresResolver, StoresService]
})
export class StoresModule {}
