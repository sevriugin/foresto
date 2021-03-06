import { MongoObservable } from 'meteor-rxjs';

import { Role, Offer } from '../models';
import { Users }       from '.';
 
export const Offers = new MongoObservable.Collection <Offer> ('offers');

Offers.allow({
  insert: byPartner,
  update: byPartner,
  remove: byPartner
});

function byPartner(userId, offer) {
  const user = userId && Users.collection.findOne(userId);
  return user && user.profile 
    && user.profile.role == Role.PARTNER 
    && offer._createdBy === userId;
}
