import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos";
import { User } from "./schemas";
import { UserRepository } from "./user.repository";
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(user: CreateUserDto) {
    console.log("user", user);

    return await this.userRepository.create({ ...user });
  }
  async findUser(username: string): Promise<User> {
    return await this.userRepository.findOne({ username });
  }

  async findUserByWallet(walletAddress: string) {
    return await this.userRepository.findOne({ walletAddress });
  }

  async findUserById(userId: string) {
    return await this.userRepository.findOne({ _id: userId });
  }
  async updateUserById(userId: string, data: any) {
    return this.userRepository.findOneAndUpdate({ _id: userId }, data);
  }
}
