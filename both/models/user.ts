
import { UserRole, UserRoleLoc } from '.';

export interface Profile {
  role: UserRole;
  roleLoc: UserRoleLoc;
}

export interface User extends Meteor.User {
  profile?: Profile;
}

// Эти поля публикуются в любом случае.
export const USER_PUBLIC = { 
  _id: 1,
  emails: 1,
  profile: 1
};
