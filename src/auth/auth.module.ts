import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  imports: [UserModule],
})
export class AuthModule {}
