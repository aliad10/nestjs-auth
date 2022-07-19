import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./../user/dtos";
import * as bcrypt from "bcryptjs";

import { ConfigService } from "@nestjs/config";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dtos";
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {}
  signup(dto: CreateUserDto) {
    const secretPepper = this.configService.get<string>("PEPPER");
    const hashPass = bcrypt.hashSync(dto.password + secretPepper, 10);

    dto.password = hashPass;

    return this.userService.create(dto);
  }
  async signin(dto: LoginDto) {
    const user = await this.userService.findUser(dto.username);
    if (!user) {
      throw new ForbiddenException("not found or invalid password");
    }

    const secretPepper = this.configService.get<string>("PEPPER");
    const isCorrectPassword = bcrypt.compareSync(
      dto.password + secretPepper,
      user.password
    );

    if (!isCorrectPassword) {
      throw new ForbiddenException("not found or invalid password");
    }

    return user;
  }
}
