import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class LoginUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
