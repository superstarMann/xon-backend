import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ILike, LessThan, Repository } from 'typeorm';
import { AllCountriesOutput } from './dtos/all-countries.dto';
import { CountryInput, CountryOutput } from './dtos/country.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { CreateShareMusleInput, CreateShareMusleOutput } from './dtos/create-sharemusle.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { DeleteShareMusleInput, DeleteShareMusleOutput } from './dtos/delete-sharemusle.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { EditShareMusleInput, EditShareMusleOutput } from './dtos/edit-sharemusle.dto';
import { MyShareMusleOutput, MyShareMusleInput } from './dtos/my-shareMusle.dto';
import { MyShareMuslesOutput } from './dtos/my-shareMusles.dto';
import { SearchShareMusleInput, SearchShareMusleOutput } from './dtos/search-shareMusle.dto';
import { ShareMusleInput, ShareMusleOutput } from './dtos/shareMusle.dto';
import { ShareMuslesInput, ShareMuslesOutput } from './dtos/shareMusles.dto';
import { Country } from './entities/country.entity';
import { Dish } from './entities/dish.entity';
import { ShareMusle } from './entities/sharemusle.entity';
import { CountryRepository } from './repositories/country.repository';

@Injectable()
export class ShareMusleService {
    constructor(
        @InjectRepository(ShareMusle) 
        private readonly shareMusles: Repository<ShareMusle>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        private readonly countries: CountryRepository
        
    ){}

    getAll(): Promise<ShareMusle[]>{
        return this.shareMusles.find();
    }

    async createShareMusle(
        owner: User,
        createShareMusleInput: CreateShareMusleInput,
      ): Promise<CreateShareMusleOutput> {
        try {
          const newShareMusle = this.shareMusles.create(createShareMusleInput);
          newShareMusle.owner = owner;
          const country = await this.countries.getOrCreate(
            createShareMusleInput.countryName,
          );
          newShareMusle.country = country;
          await this.shareMusles.save(newShareMusle);
          return {
            ok: true,
            shareMusleId: newShareMusle.id
          };
        } catch {
          return {
            ok: false,
            error: 'Could Not Create ShareMusle',
          };
        }
      }

    async editShareMusle(owner: User, editShareMusleInput: EditShareMusleInput): Promise<EditShareMusleOutput>{
      try{
        const shareMusle = await this.shareMusles.findOne(editShareMusleInput.sharemusleId)
        if(!shareMusle){
          return{
            ok: false,
            error: `ShareMusle Not Found`
          };
        }
        if(owner.id !== shareMusle.ownerId){
          return{
            ok:false,
            error: `You can't edit a ShareMusle that you don't own`
          };
        }
        let country: Country = null;
        if(editShareMusleInput.countryName){
          country = await this.countries.getOrCreate(editShareMusleInput.countryName);
        }
        await this.shareMusles.save([
          {
            id: editShareMusleInput.sharemusleId,
            ...editShareMusleInput,
            ...(country && {country}),
          }
        ]);
        return{
          ok: true
        }
      }catch(error){
        return {
          ok: false,
          error: `Could Not Edit ShareMusle`
        };
      }
    }

    async deleteShareMusle(owner: User, {shareMusleId}: DeleteShareMusleInput): Promise<DeleteShareMusleOutput>{
      try{
        const shareMusle = await this.shareMusles.findOne(shareMusleId);
        if(!shareMusle){
          return{
            ok: false,
            error: `ShareMusle Not Found`
          };
        }
        if(owner.id !== shareMusle.ownerId){
          return{
            ok: false,
            error: `You can't delete a ShareMusle that you don't own`
          };
        }
        await this.shareMusles.delete(shareMusleId);
        return{
          ok: true
        };
      }catch(error){
        return{
          ok: false,
          error: `Could Not Delete ShareMusle`
        };
      }
    }

    async allShareMusles({page}: ShareMuslesInput): Promise<ShareMuslesOutput>{
      try{
        const [shareMusles, totalResults] = await this.shareMusles.findAndCount({
          skip: (page - 1) * 8,
          take: 8,
          order:{
            isPromoted: 'DESC' // isPromoted 우선 (순서 나열)
          }
        })
        return{
          ok: true,
          results: shareMusles,
          totalPages: Math.ceil(totalResults / 8),
          totalResults
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Load ShareMusles`,
        }
      }
    }

    async myShareMusles(owner: User): Promise<MyShareMuslesOutput>{
      try{
        const shareMusles = await this.shareMusles.find({owner});
        return{
          shareMusles,
          ok: true
        }
      }catch(error){
        return{
          ok:false,
          error:`Could Not Find ShareMusles`
        }
      }
    }

    async myShareMusle(owner: User, {id}: MyShareMusleInput):Promise<MyShareMusleOutput>{
      try{
        const shareMusle = await this.shareMusles.findOne({owner, id}, {relations: ['menu', 'orders']});
        return{
          shareMusle,
          ok:true
        }
      }catch(error){
        return {
          ok: false,
          error:`Could Not Find ShareMusle`
        }
      }
    }

  async findShareMusleById({shareMusleId}: ShareMusleInput): Promise<ShareMusleOutput>{
      try{
        const shareMusle = await this.shareMusles.findOne(shareMusleId, {relations: ['menu']});
        if(!shareMusle){
          return{
            ok: false,
            error: `shareMusle Not Found`
          };
        }
        return{
          ok: true,
          shareMusle
        }
      }catch(error){
        return{
          ok:  false,
          error: `Could Not Find shareMusle`
        };
      }
    }

    async searchShareMusleByName({query, page}: SearchShareMusleInput):Promise<SearchShareMusleOutput>{
      try{
        const [shareMusles, totalResults] = await this.shareMusles.findAndCount({
          where:{
            name: ILike(`%${query}%`)
          },
          skip: (page -1) * 25,
          take: 25
        });
        return{
          ok:true,
          shareMusles,
          totalPages: Math.ceil(totalResults /25),
          totalResults
        }
      }catch(error){
        return {
          ok: false,
          error: `Could Not Find ShareMusle`
        };
      }
    }

    countShareMusles(country: Country){
      return this.shareMusles.count({country})
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

    async findCountryBySlug({slug, page}: CountryInput): Promise<CountryOutput>{
      try{
        const country = await this.countries.findOne({slug})
        if(!country){
          return{
            ok: false,
            error: `Country Not Found`
          };
        }
        const shareMusles = await this.shareMusles.find({
          where: {country},
          take: 25,
          skip: (page-1) * 25
        })
        country.shareMusles = shareMusles
        const totalResults = await this.countShareMusles(country);
        return{
          ok: true,
          country,
          shareMusles,
          totalPages: Math.ceil(totalResults / 25),
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Load Category`
        };
      }
    }

    async createDish(owner: User, createDishInput: CreateDishInput):Promise<CreateDishOutput>{
      try{
        const shareMusle = await this.shareMusles.findOne(createDishInput.shareMusleId);
        if(!shareMusle){
          return{
            ok: false,
            error: `shareMusle not found`
          };
        }
        if(owner.id !== shareMusle.ownerId){
          return{
            ok: false,
            error: `You Can't Do That`
          };
        }
        await this.dishes.save(this.dishes.create({...createDishInput, shareMusle}))
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

    async editDish(
      owner: User,
      editDishInput: EditDishInput
    ): Promise<EditDishOutput>{
      try{
        const dish = await this.dishes.findOne(editDishInput.dishId, {relations: ['shareMusle']})
        if(!dish){
          return {
            ok: false,
            error: `Dish Not Found`
          };
        }
        if(dish.shareMusle.ownerId !== owner.id){
          return{
            ok: false,
            error: `You can't do that`
          };
        }
        await this.dishes.save([
          {
            id: editDishInput.dishId,
            ...editDishInput
          }
        ]);
        return{
          ok: true
        }
      }catch(error){
        return{
          ok: false,
          error: 'Could Not Edit Dish'
        };
      }
    }

    async deleteDish(
      owner: User,
      {dishId}:DeleteDishInput
      ): Promise<DeleteDishOutput>{
      try{
        const dish = await this.dishes.findOne(dishId, {relations: ['shareMusle']});
        if(!dish){
          return{
            ok: false,
            error: `Dish not found`
          };
        }
        if(dish.shareMusle.ownerId !== owner.id){
          return{
            ok: false,
            error: `You can't do that`
          };
        }
        await this.dishes.delete(dishId);
        return{
          ok: true
        }
      }catch(error){
        return{
          ok: false,
          error: `Could Not Delete Dish`
        };
      }
    };

    @Cron('0 30 23 * * 1-5')
    async checkPromotedShareMusles() {
      const shareMusles = await this.shareMusles.find({
        isPromoted: true, 
        promotedUntil: LessThan(new Date())
      });
      console.log(shareMusles);
      shareMusles.forEach(async shareMusle => {
        shareMusle.isPromoted = false;
        shareMusle.promotedUntil = null;
        await this.shareMusles.save(shareMusle);
      })
    }

    }
