import { IsString } from "class-validator";

export class LoginWithWalletDto {
  @IsString()
  signature: string;
}
