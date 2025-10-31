import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { taskUrl } from '../../endpoints';
import { TaskRequestParams, TaskResponseModel } from '../../types';

export const postAddTask = createAsyncThunk(
  'task/postAddTask',
  async (fields: TaskRequestParams) => {
    const response = await NetWorkService.Post<TaskResponseModel>({
      url: taskUrl,
      body: fields,
    });

    return response;
  },
);
