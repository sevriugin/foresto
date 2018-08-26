import { COUNT_PUBLIC, 
         Role, 
         Partner, PARTNER_SELECTOR,
         Token, TOKEN_PUBLIC }      from 'both/models';
import { Counts, Partners, Tokens,
         Users }                    from 'both/collections';
import { Options }                  from 'client/imports/pages';


Meteor.publish('token', (_id: string): Mongo.Cursor <Token> => {
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == Role.PARTNER) {
  
    return Tokens.collection.find(
      { $and: [{ _id: _id }, { _createdBy: user._id }] },
      { fields: TOKEN_PUBLIC }
    );
  }
  else if (role == Role.CLIENT) {

    return Tokens.collection.find(
      { $and: [{ _id: _id }, { user_id: user._id }] },
      { fields: TOKEN_PUBLIC });
  }
  else {
    return;
  };
});


Meteor.publish('tokens', (): Mongo.Cursor <Token> => {
   
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == Role.PARTNER) {
  
    return Tokens.collection.find(
      { _createdBy: user._id },
      { fields: TOKEN_PUBLIC }
    );
  }
  else if (role == Role.CLIENT) {

    return Tokens.collection.find(
      { user_id: user._id },
      { fields: TOKEN_PUBLIC });
  }
  else {
    return;
  };
});


Meteor.publish('partner-tokens', (options?: Options): Mongo.Cursor <Token> => {
   
  const partner: Partner = Partners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
  );
  if (! partner) {
    return;
  }

  return Tokens.collection.find(
    { _createdBy: partner._id },
    Object.assign({}, options, { fields: TOKEN_PUBLIC })
  );
});


Meteor.publish('count-partner-tokens', () => {

  const partner: Partner = Partners.collection.findOne(
    Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
  );
  if (! partner) {
    return;
  }

  var count = 0;
  var initializing = true;

  Tokens.collection.find(
    { _createdBy: partner._id }, 
  ).observeChanges({
    added: () => {
      count++;
      if (! initializing) {
        partnerTokens(partner._id, count);
      }
    },
    removed: () => {
      count--;
      partnerTokens(partner._id, count);
    }
  });

  if (initializing) {

    initializing = false;
    partnerTokens(partner._id, count);
  }
  
  return Counts.collection.find(
    { subscription: 'partner-tokens', createdBy: partner._id }, 
    { fields: COUNT_PUBLIC }
  );
});


function partnerTokens(createdBy: string, count: number) {
  Counts.collection.upsert(
    { subscription: 'partner-tokens', createdBy: createdBy }, 
    { $set: { count: count } }
  );
}