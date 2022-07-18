import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/auth/dtos";

@Injectable()
export class UserService {
  constructor() {}

  signup(dto: CreateUserDto) {}
  signin() {}
}
