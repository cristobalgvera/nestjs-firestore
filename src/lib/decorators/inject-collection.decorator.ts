import { getCollectionToken } from '@lib/utilities';
import { Inject } from '@nestjs/common';
import { Collection } from '@util/types';

export function InjectCollection(collection: Collection) {
  return Inject(getCollectionToken(collection));
}
