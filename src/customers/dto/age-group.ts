export const AGE_GROUPS = [
  '10대',
  '20대',
  '30대',
  '40대',
  '50대',
  '60대 이상',
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export const AGE_GROUP_VALIDATION_MESSAGE = `ageGroup must be one of: ${AGE_GROUPS.join(', ')}`;
