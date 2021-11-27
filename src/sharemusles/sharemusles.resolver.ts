import { Resolver, Query, Args, Mutation, ResolveField, Int, Parent } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllCountriesOutput } from './dtos/all-countries.dto';
import { CountryInput, CountryOutput } from './dtos/country.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { CreateShareMusleInput, CreateShareMusleOutput } from './dtos/create-sharemusle.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { DeleteShareMusleInput, DeleteShareMusleOutput } from './dtos/delete-sharemusle.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { EditShareMusleInput, EditShareMusleOutput } from './dtos/edit-sharemusle.dto';
import { ShareMusleInput, ShareMusleOutput } from './dtos/shareMusle.dto';
import { ShareMuslesInput, ShareMuslesOutput } from './dtos/shareMusles.dto';
import { SearchShareMusleInput, SearchShareMusleOutput } from './dtos/search-shareMusle.dto';
import { Country } from './entities/country.entity';
import { Dish } from './entities/dish.entity';
import { ShareMusle } from './entities/sharemusle.entity';
import { ShareMusleService } from './sharemusles.service';
import { MyShareMuslesOutput } from './dtos/my-shareMusles.dto';
import { MyShareMusleOutput, MyShareMusleInput } from './dtos/my-shareMusle.dto';



@Resolver(() => ShareMusle)
export class ShareMusleResolver {
    constructor(private readonly shareMusleService: ShareMusleService){}

    @Mutation(() => CreateShareMusleOutput)
    @Role(['Guader'])
    async createShareMusle(
        @AuthUser() authUser: User,
        @Args('input') createShareMusleInput : CreateShareMusleInput
    ): Promise<CreateShareMusleOutput>{
        return this.shareMusleService.createShareMusle(authUser, createShareMusleInput)
    }

    @Mutation(() => EditShareMusleOutput)
    @Role(['Guader'])
    editShareMusle(
        @AuthUser() owner: User,
        @Args('input') editShareMusleInput : EditShareMusleInput
    ): Promise<EditShareMusleOutput>{
        return this.shareMusleService.editShareMusle(owner, editShareMusleInput)
    }

    @Mutation(() => DeleteShareMusleOutput)
    @Role(['Guader'])
    deleteShareMusle(
        @AuthUser() owner : User,
        @Args('input') deleteShareMusleInput : DeleteShareMusleInput
    ):Promise<DeleteShareMusleOutput>{
        return this.shareMusleService.deleteShareMusle(owner, deleteShareMusleInput);
    }
    @Query(() => ShareMuslesOutput)
    allShareMusle(@Args('input') shareMuslesInput: ShareMuslesInput): Promise<ShareMuslesOutput>{
        return this.shareMusleService.allShareMusles(shareMuslesInput)
    }
    
    @Query(() => ShareMusleOutput)
    shareMusle(@Args('input') shareMusleInput: ShareMusleInput):Promise<ShareMusleOutput>{
        return this.shareMusleService.findShareMusleById(shareMusleInput)
    }
        
    @Query(() => SearchShareMusleOutput)
    searchShareMusle(@Args('input') searchShareMusleInput: SearchShareMusleInput): Promise<SearchShareMusleOutput>{
        return this.shareMusleService.searchShareMusleByName(searchShareMusleInput)
    }

    @Query(() => MyShareMuslesOutput)
    @Role(['Guader'])
    myShareMusles(@AuthUser() owner: User): Promise<MyShareMuslesOutput>{
        return this.shareMusleService.myShareMusles(owner);
    }

    @Query(() => MyShareMusleOutput)
    @Role(['Guader'])
    myShareMusle(
        @AuthUser() owner : User,
        @Args('input') myShareMusleInput : MyShareMusleInput
        ):Promise<MyShareMusleOutput>{
        return this.shareMusleService.myShareMusle(owner, myShareMusleInput)
    }

}


@Resolver(() => Country)
export class CountryResolver{
    constructor(
        private readonly shareMusleService: ShareMusleService
    ){}
    
    @ResolveField(()=>Int)
    shareMusleCount(@Parent() country: Country): Promise<number>{
        return this.shareMusleService.countShareMusles(country)
    }

    @Query(() => AllCountriesOutput)
    allCountries(): Promise<AllCountriesOutput>{
        return this.shareMusleService.allCountries()
    }

    
    @Query(() => CountryOutput)
    country(@Args('input') countryInput : CountryInput): Promise<CountryOutput>{
        return this.shareMusleService.findCountryBySlug(countryInput)
    }
    
}




@Resolver(() => Dish)
export class DishResolver{
    constructor(
        private readonly shareMusleService: ShareMusleService
    ){}

    @Mutation(() => CreateDishOutput)
    @Role(['Guader'])
    createDish(
        @AuthUser() owner : User,
        @Args('input') createDishInput:CreateDishInput
    ): Promise<CreateDishOutput>{
        return this.shareMusleService.createDish(owner, createDishInput)
    }


    @Mutation(() => EditDishOutput)
    @Role(['Guader'])
    editDish(
        @AuthUser() owner: User,
        @Args('input') editDishInput: EditDishInput
    ):Promise<EditDishOutput>{
        return this.shareMusleService.editDish(owner, editDishInput)
    }

    @Mutation(() => DeleteDishOutput)
    @Role(['Guader'])
    deleteDish(
        @AuthUser() owner: User,
        @Args('input') deleteDishInput: DeleteDishInput
    ):Promise<DeleteDishOutput>{
        return this.shareMusleService.deleteDish(owner, deleteDishInput);
    }
}
