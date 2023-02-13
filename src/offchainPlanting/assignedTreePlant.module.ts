import { Module } from "@nestjs/common";
import { AssignedTreePlantController } from "./assignedTreePlant.controller";
import { AssignedTreePlantService } from "./assignedTreePlant.service";
import {
  AssignedTreePlant,
  AssignedTreePlantSchema,
  TreePlant,
  TreePlantSchema,
} from "./schemas";
import { AssignedTreePlantRepository } from "./assignedTreePlant.repository";
import { DatabaseModule } from "../database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/user/user.module";
import { TreePlantRepository } from "./treePlant.repository";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: AssignedTreePlant.name, schema: AssignedTreePlantSchema },
    ]),
    MongooseModule.forFeature([
      { name: TreePlant.name, schema: TreePlantSchema },
    ]),
    DatabaseModule,
  ],
  controllers: [AssignedTreePlantController],
  providers: [
    AssignedTreePlantService,
    AssignedTreePlantRepository,
    TreePlantRepository,
  ],
  exports: [AssignedTreePlantService],
})
export class AssignedTreePlantModule {}
