import { TaskResponseModel } from '@/api/types';
import { taskUrl } from '../../endpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';

export const getTasks = createAsyncThunk('task/getTasks', async () => {
  const response = await NetWorkService.Get<TaskResponseModel[]>({
    url: taskUrl,
  });

  return response;
});
