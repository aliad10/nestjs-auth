import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  AssignedTreePlant,
  AssignedTreePlantDocument,
  TreePlant,
  TreePlantDocument,
} from "./schemas";
import { Model } from "mongoose";
import { EntityRepository } from "../database/database.repository";

@Injectable()
export class TreePlantRepository extends EntityRepository<TreePlantDocument> {
  constructor(
    @InjectModel(TreePlant.name)
    treePlantModel: Model<TreePlantDocument>,
  ) {
    super(treePlantModel);
  }
}
