import { Item } from '.';

export interface SubPool extends Item {
  subPoolId: string;
  inprogress?: boolean;
  created: string;
  closed: string;
  numberOfMembers: string;
  numberOfActivated: string;
  debitValue: string;
  paymentAmount: string;
  value: string;
}

export const SUBPOOL_PUBLIC = {
  _id: 1,
  subPoolId: 1,
  inprogress: 1,
  created: 1,
  closed: 1,
  numberOfMembers: 1,
  numberOfActivated: 1,
  debitValue: 1,
  paymentAmount: 1,
  value: 1
};

