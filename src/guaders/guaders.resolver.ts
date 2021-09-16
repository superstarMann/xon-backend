import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateGuaderInput, CreateGuaderOutput } from './dto/create-guader.dto';
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
    async createGuader(
        @AuthUser() authUser: User,
        @Args('input') createGuaderInput : CreateGuaderInput
    ): Promise<CreateGuaderOutput>{
        return this.guaderService.createGuader(authUser, createGuaderInput)
    }

}
