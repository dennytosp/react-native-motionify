import { createAsyncThunk } from '@reduxjs/toolkit';
import { NetWorkService } from '@/api/network';
import { ResponseBase } from '@/api/network/types';
import { signUpUrl } from '../../endpoints';
import { SignUpRequestParam, SignUpResponseModel } from '../../types';

export const postSignUp = createAsyncThunk(
  'auth/signUp',
  async (fields: SignUpRequestParam) => {
    const response = await NetWorkService.Post<
      ResponseBase<SignUpResponseModel>
    >({
      url: signUpUrl,
      body: fields,
    });

    return response?.data;
  },
);
