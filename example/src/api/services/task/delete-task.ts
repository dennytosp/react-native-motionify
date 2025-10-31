import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { taskUrl } from '../../endpoints';
import { TaskRequestParams, TaskResponseModel } from '../../types';

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (fields: TaskRequestParams) => {
    const response = await NetWorkService.Delete<TaskResponseModel>({
      url: `${taskUrl}/${fields.id}`,
    });

    return response;
  },
);
