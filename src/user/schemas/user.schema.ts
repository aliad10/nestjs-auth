import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

// @Schema()
// export class User extends Document {
//   @Prop({ type: String, unique: true, isRequired: true, index: 1 })
//   username;

//   @Prop({ type: String, unique: true, isRequired: true })
//   password;

//   @Prop({ type: String, unique: true, isRequired: true, immutable: true })
//   phoneNumber;

//   @Prop({ type: String, default: "" })
//   hashedRt;

//   @Prop({ type: String, unique: true })
//   walletAddress;

//   @Prop({ type: Number })
//   nonce;

//   @Prop({ type: String })
//   firstName;

//   @Prop({ type: String })
//   lastName;

//   @Prop({ type: Date, default: Date.now })
//   createdAt;

//   @Prop({ type: Date, default: Date.now })
//   updatedAt;

//   @Prop({
//     type: String,
//     validate: [
//       (email) => {
//         var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//         return re.test(email);
//       },
//       "Please fill a valid email address",
//     ],
//   })
//   email;
// }

@Schema()
export class User extends Document {
  @Prop({ type: String, unique: true, immutable: true })
  phoneNumber;

  @Prop({ type: String, unique: true })
  walletAddress;

  @Prop({ type: Number })
  nonce;

  @Prop({ type: String })
  firstName;

  @Prop({ type: String })
  lastName;

  @Prop({ type: Date, default: Date.now })
  createdAt;

  @Prop({ type: Date, default: Date.now })
  updatedAt;

  @Prop({
    type: String,
    validate: [
      (email) => {
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
      },
      "Please fill a valid email address",
    ],
  })
  email;
}

export const UserSchema = SchemaFactory.createForClass(User);
