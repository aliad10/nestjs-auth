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
import { LoginDto, LoginWithWalletDto } from "./dtos";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { authControllerRoute } from "src/common/constants";

@Controller()
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

  @Get("auth/x/:wallet")
  getPlanter(@Param("wallet") wallet: string) {
    return this.authService.getPlanterData(wallet);
  }

  @Get(authControllerRoute.GET_NONCE)
  getNonce(@Param("wallet") wallet: string) {
    return this.authService.getNonce(wallet);
  }

  @Post(authControllerRoute.POST_LOGIN_WALLET)
  loginWithWallet(
    @Param("wallet") wallet: string,
    @Body() dto: LoginWithWalletDto
  ) {
    const signature: string = dto.signature;
    return this.authService.loginWithWallet(wallet, signature);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(authControllerRoute.GET_AUTH_ME)
  getMe(@Req() req: Request) {
    const user = req.user;

    return this.authService.getMe(user["userId"]);
  }
}
