import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [StoresModule, GraphQLModule.forRoot({
    autoSchemaFile: true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
