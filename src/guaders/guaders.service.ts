import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AllCountriesOutput } from './dto/all-countries.dto';
import { CreateGuaderInput, CreateGuaderOutput } from './dto/create-guader.dto';
import { DeleteGuaderInput, DeleteGuaderOutput } from './dto/delete-guader.dto';
import { EditGuaderInput, EditGuaderOutput } from './dto/edit-guader.dto';
import { Country } from './entities/country.entity';
import { Guader } from './entities/guader.entity';
import { CountryRepository } from './repositories/country.repository';

@Injectable()
export class GuaderService {
    constructor(
        @InjectRepository(Guader) 
        private readonly guaders: Repository<Guader>,
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

    }
