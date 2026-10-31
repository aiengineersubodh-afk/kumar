import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterInterestDto {
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

  @IsNotEmpty({ message: 'Preferred opportunity type is required' })
  @IsEnum(['INTERNSHIP', 'RESEARCH'], { message: 'Preferred type must be INTERNSHIP or RESEARCH' })
  preferredType: string;

  @IsNotEmpty({ message: 'Technical domain is required' })
  @IsString()
  @MaxLength(150)
  domain: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  customDomain?: string;

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
  introduction?: string;

  @IsNotEmpty({ message: 'Data processing and future recruitment consent is required' })
  consentAccepted: string | boolean;

  // Anti-spam honeypot
  @IsOptional()
  @IsString()
  website_hp?: string;
}
