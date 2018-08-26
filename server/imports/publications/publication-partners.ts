import { Owner, OWNER_SELECTOR, 
         Partner, PARTNER_SELECTOR, PARTNER_PUBLIC } from 'both/models';
import { Owners, Partners }                          from 'both/collections';

Meteor.publish('partners', (): Mongo.Cursor <Partner> => {
   
  const owner: Owner = Owners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, OWNER_SELECTOR)
  );
  if (! owner) {
    return;
  }  

  return Partners.collection.find(
    PARTNER_SELECTOR, 
    { fields: PARTNER_PUBLIC }
  );
});

Meteor.publish('partner', (partnerId: string): Mongo.Cursor <Partner> => {

  return Partners.collection.find(
    Object.assign({ _id: partnerId }, PARTNER_SELECTOR), 
    { fields: PARTNER_PUBLIC }
  );
});
