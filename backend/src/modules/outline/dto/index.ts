import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOutlineDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateOutlineDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}