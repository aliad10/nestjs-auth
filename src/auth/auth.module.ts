import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import * as csurf from "csurf";

import * as cookieParser from "cookie-parser";
import { AtStrategy, RtStrategy } from "./strategies";
import { VerificationRepository } from "./auth.repository";
import { Verification, VerificationSchema } from "./schemas";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "src/database/database.module";
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    AtStrategy,
    RtStrategy,
    VerificationRepository,
  ],
  imports: [
    UserModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    DatabaseModule,
  ],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   // consumer.apply(cookieParser("ser")).for;
  //   consumer
  //     .apply(
  //       csurf({
  //         cookie: true,
  //       })
  //     )
  //     .forRoutes("/auth");
  //   // .forRoutes("/auth/signin");
  // }
}
