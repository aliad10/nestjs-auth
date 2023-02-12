import { Module } from "@nestjs/common";
import { AssignedTreePlantController } from "./assignedTreePlant.controller";
import { AssignedTreePlantService } from "./assignedTreePlant.service";
import { AssignedTreePlant, AssignedTreePlantSchema } from "./schemas";
import { AssignedTreePlantRepository } from "./assignedTreePlant.repository";
import { DatabaseModule } from "../database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: AssignedTreePlant.name, schema: AssignedTreePlantSchema },
    ]),
    DatabaseModule,
  ],
  controllers: [AssignedTreePlantController],
  providers: [AssignedTreePlantService, AssignedTreePlantRepository],
  exports: [AssignedTreePlantService],
})
export class AssignedTreePlantModule {}
