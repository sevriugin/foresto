import { Item } from '.';

export interface Token extends Item {
  nft_id?: number;
  owner_address?: string;
  issued: boolean;
  user_id: string;
  activated: boolean;
  value?: number;
}

export const TOKEN_PUBLIC = {
  _id: 1,
  _createdBy: 1,
  nft_id: 1, 
  issued: 1,
  user_id: 1,
  activated: 1,
  value: 1
};

