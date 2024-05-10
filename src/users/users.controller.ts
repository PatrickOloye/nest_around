import { Body,  Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards,   } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize-interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('auth')
@Serialize(UserDto)

export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ){ }

    // @Get('validauth')
    // validauth(@Session() session: any){
    //     return this.userService.findOne(session.userId)
    // }


    @Get('validauth')
    @UseGuards(AuthGuard)
    validauth(@CurrentUser() user: User){
        // console.log(user)
        return user;
    }

    @Post('signout')
    signout(@Session() session:any){
        session.userId = null
        return "see you next time"
    }

    @Post('signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const {  email, password} = body
      const user =  await this.authService.signup(email, password)
        session.userId = user.id
        return user;
    } 

    @Post('signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const { email, password} = body
        const user =  await this.authService.signin(email, password)
        session.userId = user.id
        return user;
    }

    // @UseInterceptors( new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id:string){
        const user = await this.userService.findOne(parseInt(id))
        if(!user){
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    FindAllUsers(@Query('email') email: string){
        return this.userService.find(email)
    }
    @Get()
    findAll(){
        return this.userService.findAll()
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body)
    }

}
