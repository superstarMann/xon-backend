import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly usersService: UserService
    ){}

    @Mutation(() => CreateAccountOutput)    
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput>{
            try{
                const {ok, error} = await this.usersService.createAccount(createAccountInput);
                return{
                    ok,
                    error
                }
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
                const {ok, error, token} = await this.usersService.login(loginInput)
                return{
                    ok,
                    error,
                    token
                }
            }catch(error){
                return {
                    ok: false,
                    error
                }
            }
        }
        
    @Query(() => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        return authUser;
    }
}
