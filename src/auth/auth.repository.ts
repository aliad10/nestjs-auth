import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Verification, VerificationDocument } from "./schemas";
import { Model } from "mongoose";
import { EntityRepository } from "../database/database.repository";
@Injectable()
export class VerificationRepository extends EntityRepository<VerificationDocument> {
  constructor(
    @InjectModel(Verification.name)
    verificationModel: Model<VerificationDocument>
  ) {
    super(verificationModel);
  }
}
