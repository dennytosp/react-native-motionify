import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { CategoryRequestParams, CategoryResponseModel } from '@/api/types';
import { taskUrl } from '../../endpoints';

export const postAddCategory = createAsyncThunk(
  'category/postAddCategory',
  async (fields: CategoryRequestParams) => {
    const response = await NetWorkService.Post<CategoryResponseModel>({
      url: taskUrl,
      body: fields,
    });

    return response;
  },
);
