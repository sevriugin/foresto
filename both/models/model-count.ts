export interface Count {
  subscription: string;
  createdBy?: string;
  count: number;
}

export const COUNT_PUBLIC = {
  collection: 1,
  count: 1
};
