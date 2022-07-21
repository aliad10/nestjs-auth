import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { join } from "path";

import { MailerModule } from "@nestjs-modules/mailer";
import { createTestAccount, TestAccount } from "nodemailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),

    MailerModule.forRoot({
      transport: {
        port: 587,
        host: "smtp.ethereal.email",
        secure: false,
        auth: {
          user: "rod6@ethereal.email",
          pass: "6MFYDYJs2Aqgdh1Nq1",
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
