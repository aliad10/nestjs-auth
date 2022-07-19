import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./../user/dtos";
import { LoginDto } from "./dtos";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }
  @Post("/signin")
  signin(@Body() body: LoginDto) {
    return this.authService.signin(body);
  }
}
