import { UserRole, Token, TOKEN_PUBLIC } from 'both/models';
import { Users, Tokens }                 from 'both/collections';

Meteor.publish('token', (_id: string): Mongo.Cursor <Token> => {
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.PARTNER) {
  
    return Tokens.collection.find(
      { $and:[ {_id: _id}, {_createdBy: user._id} ] },
      { fields: TOKEN_PUBLIC }
    );
  }
  else if (role == UserRole.CLIENT) {

    return Tokens.collection.find(
      { $and:[ {_id: _id}, {user_id: user._id} ] },
      { fields: TOKEN_PUBLIC });
  }
  else {
    return;
  };
});

Meteor.publish('tokens', (): Mongo.Cursor <Token> => {
   
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.PARTNER) {
  
    return Tokens.collection.find(
      { _createdBy: user._id },
      { fields: TOKEN_PUBLIC }
    );
  }
  else if (role == UserRole.CLIENT) {

    return Tokens.collection.find(
      { user_id: user._id },
      { fields: TOKEN_PUBLIC });
  }
  else {
    return;
  };

});
