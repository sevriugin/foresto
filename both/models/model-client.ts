import { Item, Role } from '.';

export interface Client extends Item, Meteor.User {}

export const CLIENT_SELECTOR = { 'profile.role': Role.CLIENT };

// The fields "_id", "emails", "profile" are published anyway.
export const CLIENT_PUBLIC = { 
  _id: 1,
  createdAt: 1,
  username: 1,
  emails: 1,
  profile: 1
};
