import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { AllCountriesOutput } from './dto/all-countries.dto';
import { CountryInput, CountryOutput } from './dto/country.dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.entity';
import { CreateGuaderInput, CreateGuaderOutput } from './dto/create-guader.dto';
import { DeleteGuaderInput, DeleteGuaderOutput } from './dto/delete-guader.dto';
import { EditGuaderInput, EditGuaderOutput } from './dto/edit-guader.dto';
import { GuaderInput, GuaderOutput } from './dto/guader.dto';
import { GuadersInput, GuadersOutput } from './dto/guaders.dto';
import { SearchGuaderInput, SearchGuaderOutput } from './dto/search-guader.dto';
import { Country } from './entities/country.entity';
import { Dish } from './entities/dish.entity';
import { Guader } from './entities/guader.entity';
import { CountryRepository } from './repositories/country.repository';

@Injectable()
export class GuaderService {
    constructor(
        @InjectRepository(Guader) 
        private readonly guaders: Repository<Guader>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        private readonly countries: CountryRepository
        
    ){}

    getAll(): Promise<Guader[]>{
        return this.guaders.find();
    }

    async createGuader(
        owner: User,
        createGuaderInput: CreateGuaderInput,
      ): Promise<CreateGuaderOutput> {
        try {
          const newGuader = this.guaders.create(createGuaderInput);
          newGuader.owner = owner;
          const country = await this.countries.getOrCreate(
            createGuaderInput.countryName,
          );
          newGuader.country = country;
          await this.guaders.save(newGuader);
          return {
            ok: true,
          };
        } catch {
          return {
            ok: false,
            error: 'Could Not Create Guader',
          };
        }
      }

    async editGuader(owner: User, editGuaderInput: EditGuaderInput): Promise<EditGuaderOutput>{
      try{
        const guader = await this.guaders.findOne(editGuaderInput.guaderId)
        if(!guader){
          return{
            ok: false,
            error: `Guader Not Found`
          };
        }
        if(owner.id !== guader.ownerId){
          return{
            ok:false,
            error: `You can't edit a Guader that you don't own`
          };
        }
        let country: Country = null;
        if(editGuaderInput.countryName){
          country = await this.countries.getOrCreate(editGuaderInput.countryName);
        }
        await this.guaders.save([
          {
            id: editGuaderInput.guaderId,
            ...editGuaderInput,
            ...(country && {country}),
          }
        ]);
        return{
          ok: true
        }
      }catch(error){
        return {
          ok: false,
          error: `Could Not Edit Guader`
        };
      }
    }

    async deleteGuader(owner: User, {guaderId}: DeleteGuaderInput): Promise<DeleteGuaderOutput>{
      try{
        const guader = await this.guaders.findOne(guaderId);
        if(!guader){
          return{
            ok: false,
            error: `Guader Not Found`
          };
        }
        if(owner.id !== guader.ownerId){
          return{
            ok: false,
            error: `You can't delete a Guader that you don't own`
          };
        }
        await this.guaders.delete(guaderId);
        return{
          ok: true
        };
      }catch(error){
        return{
          ok: false,
          error: `Could Not Delete Guader`
        };
      }
    }

    async allCountries(): Promise<AllCountriesOutput>{
      try{
        const countries = await this.countries.find()
        return{
          ok: true,
          countries,
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Found Countries`
        }
      }
    }

    countGuaders(country: Country){
      return this.guaders.count({country})
    }

    async findCountryBySlug({slug, page}: CountryInput): Promise<CountryOutput>{
      try{
        const country = await this.countries.findOne({slug})
        if(!country){
          return{
            ok: false,
            error: `Country Not Found`
          };
        }
        const guaders = await this.guaders.find({
          where: {country},
          take: 25,
          skip: (page-1) * 25
        })
        country.guaders = guaders
        const totalResults = await this.countGuaders(country);
        return{
          ok: true,
          country,
          guaders,
          totalPages: Math.ceil(totalResults / 25),
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Load Category`
        };
      }
    }

    async allGuaders({page}: GuadersInput): Promise<GuadersOutput>{
      try{
        const [guaders, totalResults] = await this.guaders.findAndCount({
          skip: (page - 1) * 25,
          take: 25
        })
        return{
          ok: true,
          results: guaders,
          totalPages: Math.ceil(totalResults / 25),
          totalResults
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Load Guaders`,
        }
      }
    }

    async findGuaderById({guaderId}: GuaderInput): Promise<GuaderOutput>{
      try{
        const guader = await this.guaders.findOne(guaderId, {relations: ['menu']});
        if(!guader){
          return{
            ok: false,
            error: `Guader Not Found`
          };
        }
        return{
          ok: true,
          guader
        }
      }catch(error){
        return{
          ok:  false,
          error: `Could Not Find Guader`
        };
      }
    }

    async searchGuaderByName({query, page}: SearchGuaderInput):Promise<SearchGuaderOutput>{
      try{
        const [guaders, totalResults] = await this.guaders.findAndCount({
          where:{
            name: ILike(`%${query}%`)
          },
          skip: (page -1) * 25,
          take: 25
        });
        return{
          ok:true,
          guaders,
          totalPages: Math.ceil(totalResults /25),
          totalResults
        }
      }catch(error){
        return {
          ok: false,
          error: `Could Not Find Guader`
        };
      }
    }

    async createDish(owner: User, createDishInput: CreateDishInput):Promise<CreateDishOutput>{
      try{
        const guader = await this.guaders.findOne(createDishInput.guaderId);
        if(!guader){
          return{
            ok: false,
            error: `Guader not found`
          };
        }
        if(owner.id !== guader.ownerId){
          return{
            ok: false,
            error: `You Can't Do That`
          };
        }
        await this.dishes.save(this.dishes.create({...createDishInput, guader}))
        return{
          ok: true
        }
      }catch(error){
        console.log(error)
        return{
          ok: false,
          error: `Could Not Create Dish`
        };
      }
    }

    }
