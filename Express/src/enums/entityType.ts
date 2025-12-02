export const EntityType = {
  LOCATIONS: 'locations',
  AUDITS: 'audits',
  ACTIONS: 'actions',
  COMPLAINTS: 'complaints',
} as const;

export type EntityTypeValue = typeof EntityType[keyof typeof EntityType];

export const ENTITY_TYPES: readonly EntityTypeValue[] = Object.values(EntityType);

export const GqlEntityTypeEnumDefs = ENTITY_TYPES.map((entityType) => `${entityType}`).join('\n');

export function isEntityType(value: string): value is EntityTypeValue {
  return ENTITY_TYPES.includes(value as EntityTypeValue);
}