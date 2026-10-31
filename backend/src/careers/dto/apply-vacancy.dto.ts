import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ApplyVacancyDto {
  @IsNotEmpty({ message: 'Opportunity ID is required' })
  @IsString()
  opportunityId: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(120)
  fullName: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @MinLength(5, { message: 'Please enter a valid phone number' })
  @MaxLength(30)
  phone: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Present address is required' })
  @IsString()
  @MinLength(5, { message: 'Please provide your current city and address' })
  @MaxLength(500)
  presentAddress: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  linkedInUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  githubUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  coverNote?: string;

  @IsNotEmpty({ message: 'Privacy and recruitment consent is required' })
  consentAccepted: string | boolean;

  // Anti-spam honeypot
  @IsOptional()
  @IsString()
  website_hp?: string;
}
