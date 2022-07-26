import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./../user/dtos";
import { LoginDto, loginWithWalletDto } from "./dtos";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post("/signup")
  // signup(@Body() body: CreateUserDto, @Req() x) {
  //   // console.log("x", x.csrfToken());
  //   return this.authService.signup(body);
  // }
  // @Post("/signin")
  // signin(@Body() body: LoginDto, @Req() x) {
  //   console.log("x", x.headers);
  //   return this.authService.signin(body);
  // }
  // @UseGuards(AuthGuard("jwt"))
  // @Post("/logout")
  // logout(@Req() req: Request) {
  //   const user = req.user;
  //   console.log("uuuuuuu", user);
  //   return this.authService.logout(user["sub"]);
  // }

  // @UseGuards(AuthGuard("jwt-refresh"))
  // @Post("/refresh")
  // refreshToken(@Req() req: Request) {
  //   const user = req.user;
  //   return this.authService.refreshToken(user["sub"], user["refreshToken"]);
  // }

  // @Post("/verify")
  // sendMail(@Body() body) {
  //   const { username, code } = body;
  //   return this.authService.verify(username, code);
  // }

  @Get("nonce/:wallet")
  getNonce(@Param("wallet") wallet: string) {
    return this.authService.getNonce(wallet);
  }

  @Post("signinWithWallet/:wallet")
  loginWithWallet(
    @Param("wallet") wallet: string,
    @Body() dto: loginWithWalletDto
  ) {
    const signature = dto.signature;
    return this.authService.loginWithWallet(wallet, signature);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/me")
  getMe(@Req() req: Request) {
    const user = req.user;

    return this.authService.getMe(user["userId"]);
  }
}
