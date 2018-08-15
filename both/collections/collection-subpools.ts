import { MongoObservable } from 'meteor-rxjs';

import { UserRole, SubPool } from '../models';
import { Users }           from '.';
 
export const SubPools = new MongoObservable.Collection <SubPool> ('subpools');

SubPools.allow({
  insert: byPartner,
  update: byPartner,
  remove: byPartner
});

function byPartner(userId, token) {
  const user = userId && Users.collection.findOne(userId);
  return user && user.profile 
    && user.profile.role == UserRole.PARTNER 
    && token._createdBy === userId;
}
