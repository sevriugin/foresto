import { Item, Role } from '.';

interface Profile {
  role: Role;
  _createdBy?: string;
  inprogress?: boolean;
  error_message?: string;
}

export interface User extends Item, Meteor.User {
  profile?: Profile;
}

// The fields "_id", "emails", "profile" are published anyway.
export const USER_PUBLIC = { 
  _id: 1,
  createdAt: 1,
  username: 1,
  emails: 1,
  profile: 1
};
