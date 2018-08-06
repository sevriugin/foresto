import { Item } from '.';

export interface Offer extends Item {
  validFrom: string;
  expired: string;
  header: string;
  size: string;
}

export const OFFER_PUBLIC = {
  _id: 1,
  validFrom: 1,
  expired: 1,
  header: 1,
  size: 1
};

