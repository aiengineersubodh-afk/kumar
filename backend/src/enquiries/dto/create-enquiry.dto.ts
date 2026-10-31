import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEnquiryDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Country calling code is required' })
  @IsString()
  phoneCountryCode: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @MinLength(5, { message: 'Please enter a valid phone number' })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  companyName?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsNotEmpty({ message: 'Please select a required service' })
  @IsString()
  serviceName: string;

  @IsOptional()
  @IsString()
  budgetRange?: string;

  @IsOptional()
  @IsString()
  expectedTimeline?: string;

  @IsNotEmpty({ message: 'Please provide a project description' })
  @IsString()
  @MinLength(15, { message: 'Please provide at least 15 characters describing your project' })
  @MaxLength(5000)
  projectDescription: string;

  @IsOptional()
  @IsString()
  fileAttachmentUrl?: string;

  @IsOptional()
  @IsString()
  sourceTitle?: string;

  @IsOptional()
  @IsString()
  submissionType?: string;

  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  @IsBoolean()
  privacyPolicyAccepted: boolean;

  // Anti-spam honeypot (must be empty from genuine users)
  @IsOptional()
  @IsString()
  website_hp?: string;
}
