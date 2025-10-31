import { NetWorkService } from '@/api/network';
import { ResponseBase } from '@/api/network/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { signInUrl } from '../../endpoints';
import { SignInRequestParam, SignInResponseModel } from '../../types';

export const postSignIn = createAsyncThunk(
  'auth/signIn',
  async (fields: SignInRequestParam) => {
    const response = await NetWorkService.Post<
      ResponseBase<SignInResponseModel>
    >({
      url: signInUrl,
      body: fields,
    });

    return response?.data;
  },
);
