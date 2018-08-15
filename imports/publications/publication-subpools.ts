import { UserRole, SubPool, SUBPOOL_PUBLIC } from 'both/models';
import { Users, SubPools }                 from 'both/collections';

Meteor.publish('subpool', (_id: string): Mongo.Cursor <SubPool> => {
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.OWNER) {
  
    return SubPools.collection.find(
      {_id: _id},
      { fields: SUBPOOL_PUBLIC }
    );
  }
  else {
    return;
  };
});

Meteor.publish('subpools', (): Mongo.Cursor <SubPool> => {
   
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.OWNER) {
  
    return SubPools.collection.find(
      {},
      { fields: SUBPOOL_PUBLIC }
    );
  }
  else {
    return;
  };

});
