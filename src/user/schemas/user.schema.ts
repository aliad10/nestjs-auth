import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class User {
  @Prop({ type: String, unique: true, isRequired: true })
  username;

  //   @Prop({ type: String, unique: true, isRequired: true })
  //   username;
}
