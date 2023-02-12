import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AssignedTreePlant, AssignedTreePlantDocument } from "./schemas";
import { Model } from "mongoose";
import { EntityRepository } from "../database/database.repository";
@Injectable()
export class AssignedTreePlantRepository extends EntityRepository<AssignedTreePlantDocument> {
  constructor(
    @InjectModel(AssignedTreePlant.name)
    assignedTreePlantModel: Model<AssignedTreePlantDocument>
  ) {
    super(assignedTreePlantModel);
  }
}
