import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @IsOptional()
  public lastName: string;

  @IsString()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsOptional()
  public fullName: string;

  // @IsDate()
  @IsOptional()
  public birthDate: Date;

  @IsString()
  @IsOptional()
  public country: string;

}
