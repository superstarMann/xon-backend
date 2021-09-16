import { Resolver, Query, Args, Mutation, ResolveField, Int, Parent } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllCountriesOutput } from './dto/all-countries.dto';
import { CreateGuaderInput, CreateGuaderOutput } from './dto/create-guader.dto';
import { DeleteGuaderInput, DeleteGuaderOutput } from './dto/delete-guader.dto';
import { EditGuaderInput, EditGuaderOutput } from './dto/edit-guader.dto';
import { Country } from './entities/country.entity';
import { Guader } from './entities/guader.entity';
import { GuaderService } from './guaders.service';


@Resolver(() => Guader)
export class GuaderResolver {
    constructor(private readonly guaderService: GuaderService){}
    
    @Query(() => [Guader])
    guaders(): Promise<Guader[]>{
        return this.guaderService.getAll()
    }

    @Mutation(() => CreateGuaderOutput)
    @Role(['Guader'])
    async createGuader(
        @AuthUser() authUser: User,
        @Args('input') createGuaderInput : CreateGuaderInput
    ): Promise<CreateGuaderOutput>{
        return this.guaderService.createGuader(authUser, createGuaderInput)
    }

    @Mutation(() => EditGuaderOutput)
    @Role(['Guader'])
    editGuader(
        @AuthUser() owner: User,
        @Args('input') editGuaderInput : EditGuaderInput
    ): Promise<EditGuaderOutput>{
        return this.guaderService.editGuader(owner, editGuaderInput)
    }

    @Mutation(() => DeleteGuaderOutput)
    @Role(['Guader'])
    deleteGuader(
        @AuthUser() owner : User,
        @Args('input') deleteGuaderInput : DeleteGuaderInput
    ):Promise<DeleteGuaderOutput>{
        return this.guaderService.deleteGuader(owner, deleteGuaderInput);
    }

}


@Resolver(() => Country)
export class CountryResolver{
    constructor(
        private readonly guaderService: GuaderService
    ){}
    
    @ResolveField(()=>Int)
    guaderCount(@Parent() country: Country): Promise<number>{
        return this.guaderService.countGuaders(country)
    }

    @Query(() => AllCountriesOutput)
    allCountries(): Promise<AllCountriesOutput>{
        return this.guaderService.allCountries()
    }

}
