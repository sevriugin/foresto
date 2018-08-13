import { Item } from '.';

export interface Token extends Item {
  nft_id?: string;
  owner_address?: string;
  user_id: string;
  issued: boolean;
  activated: boolean;
  value?: number;
  tx?: string;
  subPoolId?: string;
}

export const TOKEN_PUBLIC = {
  _id: 1,
  nft_id: 1,
  owner_address: 1,
  user_id: 1,
  issued: 1,
  activated: 1,
  value: 1,
  tx: 1,
  subPoolId: 1
};

