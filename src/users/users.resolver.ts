import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService
    ){}

    @Query(() => Boolean)
    TestQuery(): Boolean{
        return true;
    }

    @Mutation(() => CreateAccountOutput)    
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>{
            try{
                return await this.usersService.createAccount(createAccountInput);
            }catch(error){
                return{
                    ok: false, 
                    error
                }
            }
        };

    @Mutation(() => LoginOutput)
    async login(
        @Args('input') loginInput: LoginInput): Promise<LoginOutput>{
            try{
                return await this.usersService.login(loginInput)
            }catch(error){
                return {
                    ok: false,
                    error
                }
            }
        }
        
}
