import { IsDate, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public lastName: string;

  @IsString()
  public firstName: string;

  @IsDate()
  public birthDate: Date;

  @IsString()
  public country: string;

}
