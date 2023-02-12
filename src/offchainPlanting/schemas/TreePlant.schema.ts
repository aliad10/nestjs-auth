import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TreePlantDocument = TreePlant & Document;

@Schema()
export class TreePlant extends Document {
  @Prop({ type: String })
  signer;

  @Prop({ type: Number })
  nonce;

  @Prop({ type: String })
  treeSpecs;

  @Prop({ type: Number })
  birthDate;

  @Prop({ type: Number })
  countryCode;

  @Prop({ type: String })
  signature;

  @Prop({ type: Number })
  status;

  @Prop({ type: Date, default: Date.now })
  createdAt;

  @Prop({ type: Date, default: Date.now })
  updatedAt;
}

export const TreePlantSchema = SchemaFactory.createForClass(TreePlant);
