import {
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateTaskDto {
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

  @IsOptional()
  @IsString()
  address?: string;
}
