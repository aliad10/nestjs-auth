import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos";
import * as bcrypt from "bcryptjs";

import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}
  signup(dto: CreateUserDto) {
    //   bcrypt.hash("ssss", 10);

    const secretPepper = this.configService.get<string>("PEPPER");
    const hashPass = bcrypt.hashSync(dto.password + secretPepper, 10);
  }
  signin() {}
}
