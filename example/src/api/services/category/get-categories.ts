import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { CategoryResponseModel } from '@/api/types';
import { categoryUrl } from '../../endpoints';

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async () => {
    const response = await NetWorkService.Get<CategoryResponseModel[]>({
      url: categoryUrl,
    });

    return response;
  },
);
