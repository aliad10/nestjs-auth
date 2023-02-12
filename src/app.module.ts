import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { AssignedTreePlantModule } from "./offchainPlanting/assignedTreePlant.module";
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    AssignedTreePlantModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
