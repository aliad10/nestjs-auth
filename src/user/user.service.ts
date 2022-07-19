import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos";
import { User } from "./schemas";
import { UserRepository } from "./user.repository";
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  create(user: CreateUserDto) {
    return this.userRepository.create({ ...user });
  }
  async findUser(username: string): Promise<User> {
    return await this.userRepository.findOne({ username });
  }
}
