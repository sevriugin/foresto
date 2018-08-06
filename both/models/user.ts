
import { UserRole } from '.';

export interface Profile {
  role: UserRole;
  _createdBy?: string;
}

export interface User extends Meteor.User {
  profile?: Profile;
}

// But username, the fields is published anyway.
export const USER_PUBLIC = { 
  _id: 1,
  username: 1,
  emails: 1,
  profile: 1
};
