import { TasksPage }   from './tasks';
import { TasksForm }   from './form';
import { TaskDetails } from './details';

export * from './tasks';
export * from './form';
export * from './details';

export const TASKS_PAGES = [
  TasksPage,
  TasksForm,
  TaskDetails
];