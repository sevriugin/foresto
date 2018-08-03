import { Item } from '.';

export interface Task extends Item {
  text?: string;
  username?: string;
  private?: boolean;
  checked?: boolean;
  public: boolean;  
}

export const TASK_PUBLIC = {
  _id: 1,
  _createdBy: 1,
  text: 1, 
  checked: 1,
  public: 1
};

