import { check } from 'meteor/check';

import { User, UserRole, UserRoleLoc } from '../models';
import { Users }                 from '../collections';
 
Meteor.methods({

  addPartner: function (email: string): string {

    check(email, String);
    const _id = Accounts.createUser({ email: email, password: '******', profile: { role: UserRole.PARTNER, roleLoc: UserRoleLoc.partner } });
    return _id;
  },

  deletePartner: function (_id: string): void {

    check(_id, String);

    const user = Users.collection.findOne(_id);
    if (! user ) {
      throw new Meteor.Error('404', 'No such user!');
    };
    if (! (user.profile && user.profile.role == UserRole.PARTNER)) {
      throw new Meteor.Error('400', 'That user is not partner...');
    }

    Meteor.users.remove(_id);
  }

});