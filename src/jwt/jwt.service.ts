import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions } from './jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
        private readonly configService: ConfigService
    ){}
    /*
    sign(payload: object): string{
        return jwt.sign(payload, this.configService.get("PRIVATE_KEY")) config = global이니깐 바로 갈겨도 됨
    }
    */
    sign(userId: number): string{
        return jwt.sign({id: userId}, this.options.privateKey)
    }

    verify(token: string){
        return jwt.verify(token, this.options.privateKey)
    }
}
