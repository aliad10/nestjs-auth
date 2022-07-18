import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dtos";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);

    // this.userService.signup({
    //   firstName: "ssss",
    //   email: "",
    //   lastName: "",
    //   password: "",
    //   phoneNumber: "",
    // });
  }
  @Post("/signin")
  signin() {}
}
