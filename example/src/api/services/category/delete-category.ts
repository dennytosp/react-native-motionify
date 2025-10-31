import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { categoryUrl } from '../../endpoints';
import { CategoryRequestParams, CategoryResponseModel } from '@/api/types';

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (fields: CategoryRequestParams) => {
    const response = await NetWorkService.Delete<CategoryResponseModel>({
      url: `${categoryUrl}/${fields.id}`,
    });

    return response;
  },
);
