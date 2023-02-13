import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  AssignedTreePlant,
  AssignedTreePlantDocument,
  UpdateTree,
  UpdateTreeDocument,
} from "./schemas";
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

@Injectable()
export class UpdateTreeRepository extends EntityRepository<UpdateTreeDocument> {
  constructor(
    @InjectModel(UpdateTree.name)
    updateTreeModel: Model<UpdateTreeDocument>
  ) {
    super(updateTreeModel);
  }
}
