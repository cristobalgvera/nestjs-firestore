import { Inject } from '@nestjs/common';
import { Collection } from '../../util/types';
import { getCollectionToken } from '../utilities';

export function InjectCollection(collection: Collection) {
  return Inject(getCollectionToken(collection));
}
