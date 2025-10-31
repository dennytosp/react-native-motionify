import { TaskResponseModel } from '@/api/types';

export type TaskState = {
  task: TaskResponseModel[];
  completedTask: TaskResponseModel[];
};
