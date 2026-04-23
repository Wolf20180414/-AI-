import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';

export enum ProjectStatus {
  DRAFT = 'draft',
  WRITING = 'writing',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetWordCount?: number;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetWordCount?: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

export class ProjectQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number;
}