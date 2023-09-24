import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AuthenService } from './authen.service';

import { JwtService } from '../../utils/jwt';

import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthenticationDto } from './dto/login.dto';

@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService, private readonly usersService: UsersService, private readonly jwt: JwtService) { }

  @Post('login')
  async memberAuthentication(@Body() authenticationDto: AuthenticationDto, @Res() res: Response) {
    try {
      let userDecode = this.jwt.verifyToken(authenticationDto.token);

      if (userDecode) {
        let serResUser = await this.usersService.findById(userDecode.id);
        if (serResUser.status) {
          if (userDecode.updateAt == serResUser.data.updateAt) {
            return res.status(200).json(serResUser);
          }
        }
      }
      return res.status(213).json({
        message: "Authen failed!"
      })
    } catch (err) {
      return res.status(500).json({
        message: "Lỗi controller"
      })
    }
  }


}
