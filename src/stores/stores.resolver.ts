import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateStoreDto } from './dto/create-store.dto';
import {Store} from './entities/store.entity'

@Resolver(() => Store)
export class StoresResolver {
    @Query(() => Store) store(){
        return true
    }

    @Mutation(() => Boolean)
    createStore(
        @Args() createStoreDto: CreateStoreDto
    ): boolean {
        return true;
    }

}
