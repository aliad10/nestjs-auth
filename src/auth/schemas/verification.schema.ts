import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type VerificationDocument = Verification & Document;

@Schema()
export class Verification extends Document {
  @Prop({ type: String, isRequired: true, index: 1 })
  code;

  @Prop({ type: String, isRequired: true })
  username;

  @Prop({ type: Date, default: Date.now() + 120 })
  expireAt;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
