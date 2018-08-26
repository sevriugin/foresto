import { COUNT_PUBLIC,
         Partner, PARTNER_SELECTOR,
         Client, CLIENT_SELECTOR, CLIENT_PUBLIC } from 'both/models';
import { Counts, Partners, Clients }              from 'both/collections';
import { Options }                                from 'client/imports/pages';


Meteor.publish('client', (clientId: string): Mongo.Cursor <Client> => {

  return Clients.collection.find(
    Object.assign({ _id: clientId }, CLIENT_SELECTOR), 
    { fields: CLIENT_PUBLIC }
  );
});


Meteor.publish('partner-clients', (options?: Options): Mongo.Cursor <Client> => {

  const partner: Partner = Partners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
  );
  if (! partner) {
    return;
  }

  return Clients.collection.find(
    Object.assign({ 'profile._createdBy': partner._id }, CLIENT_SELECTOR), 
    Object.assign({}, options, { fields: CLIENT_PUBLIC })
  );
});


Meteor.publish('count-partner-clients', () => {

  const partner: Partner = Partners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
  );
  if (! partner) {
    return;
  }

  var count = 0;
  var initializing = true;

  Clients.collection.find(
    Object.assign({ 'profile._createdBy': partner._id }, CLIENT_SELECTOR), 
  ).observeChanges({
    added: () => {
      count++;
      if (! initializing) {
        partnerClients(partner._id, count);
      }
    },
    removed: () => {
      count--;
      partnerClients(partner._id, count);
    }
  });

  if (initializing) {

    initializing = false;
    partnerClients(partner._id, count);
  }
  
  return Counts.collection.find(
    { subscription: 'partner-clients', createdBy: partner._id }, 
    { fields: COUNT_PUBLIC }
  );
});


function partnerClients(createdBy: string, count: number) {
  Counts.collection.upsert(
    { subscription: 'partner-clients', createdBy: createdBy }, 
    { $set: { count: count } }
  );
}