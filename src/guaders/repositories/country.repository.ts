import { EntityRepository, Repository } from "typeorm";
import { Country } from "../entities/country.entity";

@EntityRepository(Country)
export class CountryRepository extends Repository<Country> {
  async getOrCreate(name: string): Promise<Country> {
    const countryName = name.trim().toLowerCase().replace(/ +/g, ' ');
    const countrySlug = countryName.replace(/ /g, '-');
    let country = await this.findOne({ slug: countrySlug });
    if (!country) {
      country = await this.save(
        this.create({ slug: countrySlug, name: countryName }),
      );
    }
    return country;
  }
}