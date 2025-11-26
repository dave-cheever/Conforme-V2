import { ElementType } from 'react';
import * as Icons from '../icons';

/**
 * Return an icon component from the ../icons index only when the name matches exactly.
 * Example: getIconByName('OutlineFlag') -> returns OutlineFlag component if exported.
 * If there's no exact match, returns the ConformeNew Icon.
 */
export function getIconByName(name: string): ElementType {
  return (Icons as any)[name] ?? (Icons as any)['ConformeNew'];
}

export default getIconByName;