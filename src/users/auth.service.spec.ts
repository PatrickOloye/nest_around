import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {BadRequestException, NotFoundException} from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService;
  let  notUserService: Partial<UsersService>

  notUserService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) => Promise.resolve({id: 1, email, password} as User),
  }

  
  beforeEach(async () => {
   

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: notUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('create new user with hashed and salted passowrd', async() => {
    const user = await service.signup("shawn@shawn.com", "password");

    expect(user.password).not.toEqual('password')
    const[salt, hash] = user.password.split('|')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it("throws an error if user signs up with email in use", async()=>{
    notUserService.find = () => 
      Promise.resolve([{id:1, email: "a", password: "1" } as User])
    

      await expect(service.signup("shawn@shawn.com", "shawn")).rejects.toThrow(BadRequestException)
   
  })

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('shaw@shawn.com', 'shawn'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    notUserService.find = () =>
      Promise.resolve([
        { email: 'shawn@shawn.com', password: 'laskdjf' } as User,
      ]);
    await expect(
      service.signin('shawn@shawn.com', 'shawn'),
    ).rejects.toThrow(NotFoundException);
  });

  // it('returns a user if correct password is provided', async () => {
    // notUserService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'shawn@shawn.com',
    //       password:
    //         '1f3f1f78b727fa56.af7186ab0d0a8e9cf1ae2c5c179784947a2fe349d3a3e82f6422c0d7cbc2f925',
    //     } as User,
    //   ]);

    // const user = await service.signin('shawn@shawn.com', 'shawn');
    // expect(user).toBeDefined();

  //   const user = await service.signup('james@james.com', "shawn7")
  //   console.log(user)
  // });
});


// it('can create an instance of the auth service', async() => {

// })