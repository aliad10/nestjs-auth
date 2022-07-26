import { IsString } from "class-validator";

export class loginWithWalletDto {
  @IsString()
  signature: string;
}
