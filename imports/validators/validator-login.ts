import { User, Role } from 'both/models';
import { Users }      from 'both/collections';

Accounts.validateNewUser((user: User) => {

  //->>
  //Accounts.sendVerificationEmail('7kuiFg8A5LzihvDt7');

  if (user.profile && user.profile.role == Role.OWNER) {

    if (Users.collection.findOne({ 'profile.role': Role.OWNER })) {
      throw new Meteor.Error(403, 'The owner user already exists.');
    }
  }
  return true;
});