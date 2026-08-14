import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AGE_GROUPS, AGE_GROUP_VALIDATION_MESSAGE } from './age-group';
import type { AgeGroup } from './age-group';

export class CreateCustomerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  participantNo: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  matchedParticipantNo?: string | null;

  @IsIn(AGE_GROUPS, { message: AGE_GROUP_VALIDATION_MESSAGE })
  ageGroup: AgeGroup;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsString()
  email?: string;

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
