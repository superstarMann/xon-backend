import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import {Store} from './entities/store.entity'
import { StoreService } from './stores.service';

@Resolver(() => Store)
export class StoreResolver {
    constructor(private readonly storeService: StoreService){}
    
    @Query(() => [Store])
    stores(): Promise<Store[]>{
        return this.storeService.getAll()
    }

    @Mutation(() => Boolean)
    async createStore(
        @Args('input') createStoreDto: CreateStoreDto
    ): Promise<Boolean>{
        try{
            await this.storeService.createStore(createStoreDto);
            return true;
        }catch(error){
            console.log(error)
            return false;
        }
    }

    @Mutation(() => Boolean)
    async updateStore(
        @Args('input') updateStoreDto: UpdateStoreDto
    ){
        try{
            await this.storeService.updateStore(updateStoreDto)
            return true;
        }catch(error){
            return false
        }
    }

}
