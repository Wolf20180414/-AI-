import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsString()
  startHint?: string;

  @IsOptional()
  @IsString()
  endHint?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsString()
  startHint?: string;

  @IsOptional()
  @IsString()
  endHint?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  status?: string;
}