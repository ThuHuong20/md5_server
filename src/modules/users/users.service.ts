import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FindByIdSerRes, RegisterSerRes, UpdateSerRes } from './users.interface';
import validation from 'src/utils/validation';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private users: Repository<User>) { }

  async register(createUserDto: CreateUserDto): Promise<RegisterSerRes> {
    try {
      let newUser = this.users.create(createUserDto);
      const results = await this.users.save(newUser);
      return {
        status: true,
        data: results,
        message: 'Sign up successfully'
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "User is already exist!"
      }
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateSerRes> {
    try {
      let userSource = await this.users.findOne({
        where: {
          id: userId
        }
      })
      let userSourceUpdate = this.users.merge(userSource, updateUserDto);
      let result = await this.users.save(userSourceUpdate);
      return {
        status: true,
        data: result,
        message: "Update ok!"
      }
    } catch (err) {
      return {
        status: false,
        data: null,
        message: "Lỗi model1"
      }
    }
  }
  async findById(userId: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: {
          id: userId
        }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user by id ok!"
      }
    } catch (err) {
      console.log("🚀 ~ file: users.service.ts:75 ~ UsersService ~ findById ~ err:", err)
      return {
        status: false,
        data: null,
        message: "Lỗi model2"
      }
    }
  }

  async findByEmailOrUserName(emailOrUserName: string): Promise<FindByIdSerRes> {
    try {
      let result = await this.users.findOne({
        where: validation.isEmail(emailOrUserName)
          ? {
            email: emailOrUserName,
            emailAuthentication: true
          }
          : {
            userName: emailOrUserName
          }
      });

      if (!result) {
        throw new Error
      }

      return {
        status: true,
        data: result,
        message: "Find user ok!"
      }
    } catch (err) {
      console.log("🚀 ~ file: users.service.ts:107 ~ UsersService ~ findByEmailOrUserName ~ err:", err)
      return {
        status: false,
        data: null,
        message: "Lỗi model3"
      }
    }
  }
}
