
import { UserRole, UserRoleLoc } from '.';

export interface Profile {
  role: UserRole;
  roleLoc: UserRoleLoc;
}

export interface User extends Meteor.User {
  profile?: Profile;
}

export const USER_PUBLIC = { 
  _id: 1
};
