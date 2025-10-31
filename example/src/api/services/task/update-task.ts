import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { taskUrl } from '../../endpoints';
import { TaskRequestParams, TaskResponseModel } from '../../types';

export const putUpdateTask = createAsyncThunk(
  'task/putUpdateTask',
  async (fields: TaskRequestParams) => {
    const response = await NetWorkService.Put<TaskResponseModel>({
      url: `${taskUrl}/${fields.id}`,
      body: fields,
    });

    return response;
  },
);
