import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOpportunityDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(200)
  title: string;

  @IsNotEmpty({ message: 'Opportunity type is required' })
  @IsEnum(['INTERNSHIP', 'RESEARCH'], { message: 'Type must be INTERNSHIP or RESEARCH' })
  type: string;

  @IsNotEmpty({ message: 'Technical field is required' })
  @IsString()
  @MaxLength(150)
  technicalField: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters' })
  @MaxLength(10000)
  description: string;

  @IsOptional()
  @IsArray()
  responsibilities?: string[];

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  eligibility?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  duration?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  workMode?: string;

  @IsOptional()
  @IsNumber()
  openingsCount?: number;

  @IsOptional()
  @IsString()
  deadline?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsEnum(['OPEN', 'CLOSED', 'ARCHIVED'])
  status?: string;
}
