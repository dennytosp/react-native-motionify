import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { ResponseBase } from '@/api/network/types';
import { signOutUrl } from '../../endpoints';
import { SignOutRequestParam, SignOutResponseModel } from '../../types';

export const postSignOut = createAsyncThunk(
  'auth/signOut',
  async (fields: SignOutRequestParam) => {
    const response = await NetWorkService.Post<
      ResponseBase<SignOutResponseModel>
    >({
      url: signOutUrl,
      body: fields,
    });

    return response?.data;
  },
);
