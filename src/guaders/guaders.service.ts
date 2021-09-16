import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGuaderInput, CreateGuaderOutput } from './dto/create-guader.dto';
import { Country } from './entities/country.entity';
import { Guader } from './entities/guader.entity';

@Injectable()
export class GuaderService {
    constructor(
        @InjectRepository(Guader) private readonly guaders: Repository<Guader>,
        @InjectRepository(Country) private readonly countries: Repository<Country>
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
          const countryName = createGuaderInput.countryName
            .trim()
            .toLowerCase();
          const countrySlug = countryName.replace(/ /g, '-');
          let country = await this.countries.findOne({ slug: countrySlug });
          if (!country) {
            country = await this.countries.save(
              this.countries.create({ slug: countrySlug, name: countryName }),
            );
          }
          newGuader.country = country;
          await this.guaders.save(newGuader);
          return {
            ok: true,
          };
        } catch {
          return {
            ok: false,
            error: 'Could not create Guader',
          };
        }
    }

    }
