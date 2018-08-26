import { Item, Role } from '.';

export interface Owner extends Item, Meteor.User {}

export const OWNER_SELECTOR = { 'profile.role': Role.OWNER };

// The fields "_id", "emails", "profile" are published anyway.
export const OWNER_PUBLIC = { 
  _id: 1,
  username: 1,
  emails: 1,
  profile: 1
};
