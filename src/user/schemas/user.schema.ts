import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class User {
  toLower(email: string): string {
    return email.toLowerCase();
  }

  @Prop({ type: String, unique: true, isRequired: true, index: 1 })
  username;

  @Prop({ type: String, unique: true, isRequired: true })
  password;

  @Prop({ type: String, unique: true, isRequired: true, immutable: true })
  phoneNumber;

  @Prop({ type: String })
  firstName;

  @Prop({ type: String })
  lastName;

  @Prop({ type: Date, default: Date.now })
  createdAt;

  @Prop({ type: Date, default: Date.now })
  updatedAt;

  @Prop({})
  email;
}
