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

/**
 * PATCH /customers/:id 로 수정할 수 있는 필드 전체.
 * id / participantNo / createdAt 은 의도적으로 제외한다.
 * participantNo 는 바코드 스캔의 조회 기준값이라 바뀌면 스캔이 깨진다.
 */

/** 값을 보냈을 때만 검증한다. 생략(undefined)은 통과, null 은 검증 대상. */
const isProvided = (_: unknown, value: unknown) => value !== undefined;

export class UpdateCustomerDto {
  @ValidateIf(isProvided)
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  matchedParticipantNo?: string | null;

  @ValidateIf(isProvided)
  @IsIn(AGE_GROUPS, { message: AGE_GROUP_VALIDATION_MESSAGE })
  ageGroup?: AgeGroup;

  @ValidateIf(isProvided)
  @IsString()
  address?: string;

  @ValidateIf(isProvided)
  @IsString()
  memo?: string;

  @ValidateIf(isProvided)
  @IsBoolean()
  letter1Arrived?: boolean;

  @ValidateIf(isProvided)
  @IsBoolean()
  letter2Arrived?: boolean;

  @ValidateIf(isProvided)
  @IsBoolean()
  letter3Arrived?: boolean;
}
