import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  deleteCategory,
  getCategories,
  postAddCategory,
  putUpdateCategory,
} from '@/api/services/category';
import { CategoryState } from '../types/category';
import { RootState } from '../types/root';
import { CategoryResponseModel } from '@/api/types';

const initialCategoryState: CategoryState = {
  category: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState: initialCategoryState,
  reducers: {
    onSetCategories: (
      state,
      action: PayloadAction<CategoryResponseModel[]>,
    ) => {
      state.category = action.payload || [];
    },
  },

  extraReducers: builder => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      const uniqueCategory = action.payload.filter((item, index, self) => {
        const findIndexObject = self.findIndex(obj => obj.name === item.name);
        return findIndexObject === index;
      });

      state.category = uniqueCategory || [];
    });
    builder.addCase(postAddCategory.fulfilled, (state, action) => {
      state.category = [...state.category, ...[action.payload]];
    });
    builder.addCase(putUpdateCategory.fulfilled, (state, action) => {
      const findIndexCategory = state.category.findIndex(
        (item, index) => item.id === action.payload.id,
      );

      if (findIndexCategory !== -1) {
        state.category[findIndexCategory] = action.payload;
      }
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      const newCategory = state.category.filter(
        item => item.id !== action.payload.id,
      );
      state.category = newCategory;
    });
  },
});

export const { reducer: categoryReducer, actions: categoryActions } =
  categorySlice;

export const getCategoryState = (state: RootState) => state.category;
