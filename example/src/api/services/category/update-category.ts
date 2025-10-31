import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { CategoryRequestParams, CategoryResponseModel } from '@/api/types';
import { categoryUrl } from '../../endpoints';

export const putUpdateCategory = createAsyncThunk(
  'category/putUpdateCategory',
  async (fields: CategoryRequestParams) => {
    const response = await NetWorkService.Put<CategoryResponseModel>({
      url: `${categoryUrl}/${fields.id}`,
      body: fields,
    });

    return response;
  },
);
