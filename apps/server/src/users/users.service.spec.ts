// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
// import { Repository } from 'typeorm';
// import { NotFoundException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { UserDto } from 'src/auth/dto/createUser.dto';

// describe('UsersService', () => {
//   let service: UsersService;
//   let repo: Repository<User>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: {
//             findOne: jest.fn(),
//             create: jest.fn(),
//             save: jest.fn(),
//             remove: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     repo = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   it('서비스가 정의되어 있어야 합니다', () => {
//     expect(service).toBeDefined();
//   });

//   describe('findByFields', () => {
//     it('사용자를 찾았을 때 해당 사용자를 반환해야 합니다', async () => {
//       const user = new User();
//       jest.spyOn(repo, 'findOne').mockResolvedValue(user);
//       expect(await service.findByFields({ where: { userId: 1 } })).toBe(user);
//     });

//     it('사용자를 찾지 못했을 때 undefined를 반환해야 합니다', async () => {
//       jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);
//       expect(await service.findByFields({ where: { userId: 1 } })).toBeUndefined();
//     });
//   });

//   describe('save', () => {
//     it('비밀번호를 해시화하고 사용자를 저장해야 합니다', async () => {
//       const userDto: UserDto = {
//         email: 'test@test.com',
//         password: 'password',
//         name: 'Test User',
//         nickname: 'tester',
//         profileImage: '',
//         gitUrl: 'https://github.com/tester',
//         introduce: 'Hello, I am a tester',
//       };
//       const hashedPassword = 'hashedPassword';
//       const createdUser = { ...userDto, password: hashedPassword };

//       jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
//       jest.spyOn(repo, 'create').mockReturnValue(createdUser as User);
//       jest.spyOn(repo, 'save').mockResolvedValue(createdUser as User);

//       const result = await service.save(userDto);

//       expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 12);
//       expect(repo.create).toHaveBeenCalledWith(createdUser);
//       expect(repo.save).toHaveBeenCalledWith(createdUser);
//       expect(result).toEqual(createdUser);
//     });
//   });

//   describe('deleteUser', () => {
//     it('사용자를 찾았을 때 해당 사용자를 삭제해야 합니다', async () => {
//       const user = new User();
//       jest.spyOn(repo, 'findOne').mockResolvedValue(user);
//       jest.spyOn(repo, 'remove').mockResolvedValue(user);

//       await service.deleteUser(1);

//       expect(repo.findOne).toHaveBeenCalledWith({ where: { userId: 1 } });
//       expect(repo.remove).toHaveBeenCalledWith(user);
//     });

//     it('사용자를 찾지 못했을 때 NotFoundException을 발생시켜야 합니다', async () => {
//       jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);

//       await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
