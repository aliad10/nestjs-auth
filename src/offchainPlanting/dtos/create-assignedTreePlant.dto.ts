import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAssiggnedTreePlantDto {
  @IsString()
  signer: string;

  @IsNumber()
  nonce: number;

  @IsNumber()
  treeId: number;

  @IsString()
  treeSpecs: string;

  @IsNumber()
  birthDate: number;

  @IsNumber()
  countryCode: number;

  @IsString()
  signature: string;
}
