import { Item, Role } from '.';

export interface Partner extends Item, Meteor.User {}

export const PARTNER_SELECTOR = { 'profile.role': Role.PARTNER };

// The fields "_id", "emails", "profile" are published anyway.
export const PARTNER_PUBLIC = { 
  _id: 1,
  createdAt: 1,
  username: 1,
  emails: 1,
  profile: 1
};
