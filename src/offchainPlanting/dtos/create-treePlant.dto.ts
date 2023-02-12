import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTreePlantDto {
  @IsString()
  signer: string;

  @IsNumber()
  nonce: number;

  @IsString()
  treeSpecs: string;

  @IsNumber()
  birthDate: number;

  @IsNumber()
  countryCode: number;

  @IsString()
  signature: string;
}
