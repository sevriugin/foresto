import { Owner, OWNER_SELECTOR, OWNER_PUBLIC } from 'both/models';
import { Owners }                              from 'both/collections';

Meteor.publish('owner', (ownerId: string): Mongo.Cursor <Owner> => {
  
  return Owners.collection.find(
    Object.assign({ _id: ownerId }, OWNER_SELECTOR), 
    { fields: OWNER_PUBLIC }
  );
});
