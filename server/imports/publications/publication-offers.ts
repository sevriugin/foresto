import { DatePipe }                          from '@angular/common'
import { COUNT_PUBLIC,
         Partner, PARTNER_SELECTOR,
         Client, CLIENT_SELECTOR, 
         Offer, OFFER_PUBLIC }               from 'both/models';
import { Counts, Partners, Clients, Offers } from 'both/collections';
import { Options }                           from 'client/imports/pages';


Meteor.publish('partner-offers', (options?: Options): Mongo.Cursor <Offer> => {
   
  const partner: Partner = Partners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
  );
  if (! partner) {
    return;
  }

  return Offers.collection.find(
    { _createdBy: partner._id }, 
    Object.assign({}, options, { fields: OFFER_PUBLIC })
  );
});


Meteor.publish('client-offers', (options?: Options): Mongo.Cursor <Offer> => {
   
  const client: Client = Clients.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, CLIENT_SELECTOR)
  );
  if (! client) {
    return;
  }

  const datePipe = new DatePipe("en-US");
  const moment = new Date();
  const momentStr = datePipe.transform(moment, 'yyyy-MM-dd');

  return Offers.collection.find(
    { validFrom: { $lte: momentStr }, expired: { $gte: momentStr } }, 
    { fields: OFFER_PUBLIC }
  );
});


Meteor.publish('count-partner-offers', () => {

  const partner: Partner = Partners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
  );
  if (! partner) {
    return;
  }

  var count = 0;
  var initializing = true;

  Offers.collection.find(
    { _createdBy: partner._id }, 
  ).observeChanges({
    added: () => {
      count++;
      if (! initializing) {
        partnerOffers(partner._id, count);
      }
    },
    removed: () => {
      count--;
      partnerOffers(partner._id, count);
    }
  });

  if (initializing) {

    initializing = false;
    partnerOffers(partner._id, count);
  }
  
  return Counts.collection.find(
    { subscription: 'partner-offers', createdBy: partner._id }, 
    { fields: COUNT_PUBLIC }
  );
});


function partnerOffers(createdBy: string, count: number) {
  Counts.collection.upsert(
    { subscription: 'partner-offers', createdBy: createdBy }, 
    { $set: { count: count } }
  );
}