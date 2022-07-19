import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;
}
