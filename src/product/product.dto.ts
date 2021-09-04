import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/user/user.entity';

export class ProductDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class CreateProductDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @Exclude()
  owner: UserEntity;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
