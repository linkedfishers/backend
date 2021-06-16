import { IsEmail, IsString, IsOptional, isString } from 'class-validator';

export class CreateProviderDto {
  @IsEmail()
  public companyEmail: string;

  @IsString()
  public password: string;
  @IsOptional()
  public companyName: string;
}
