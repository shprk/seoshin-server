import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  participantNo?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  matchedParticipantNo?: string | null;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsBoolean()
  letter1Arrived?: boolean;

  @IsOptional()
  @IsBoolean()
  letter2Arrived?: boolean;

  @IsOptional()
  @IsBoolean()
  letter3Arrived?: boolean;
}
