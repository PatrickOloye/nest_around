import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';


const scrypt = promisify(_scrypt)


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){

    }

    async signup(email: string, password: string){
        //see if email is inuse
        const users = await this.usersService.find(email)
        if(users.length){
            throw new BadRequestException('email already exsists')
            // throw new NotFoundException('email already exsists')
        }
        //Hash User Password
        const salt = randomBytes(8).toString('hex')
        const hash = (await scrypt(password, salt, 32) as Buffer)
        const resl = salt + "|" + hash.toString('hex');

        //create a new user and save it
        const user = await this.usersService.create(email, resl)

        //return the user
        return user
    }
    async signin(email: string, password: string){
        //find user with said email
        const [user] = await this.usersService.find(email)
        if(!user){
            throw new NotFoundException("no user with  email" + email + "is not found")
        }
        const [salt, hash] = user.password.split('|');
        const newHash = (await scrypt(password, salt, 32) as Buffer)
        if(newHash.toString('hex')!== hash){
            throw new NotFoundException('incorrect username or password')
        }
        return user;
    }
}
