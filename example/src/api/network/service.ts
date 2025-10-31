import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { StyleSheet } from 'react-native';

import Config from '@/config/environment';
import { hideAppLoader } from '@/utils/holder';
import { API_CONFIG } from './config';
import { abortController, handleParameter } from './helper';
import { ParameterPostFormData, ParamsNetwork, ResponseBase } from './types';

const TOKEN_KEY_HEADER = 'authorization';
const X_API_KEY = 'X-ApiKey';
const CONTENT_TYPE = 'Content-Type';

const AxiosInstance = Axios.create({});

let isAlreadyFetchingAccessToken = false;

let CANCEL_TOKEN_SOURCE = Axios.CancelToken.source();

const generateNewCancelTokenSource = () => {
  CANCEL_TOKEN_SOURCE = Axios.CancelToken.source();
};

const finishPendingRequests = () => {
  CANCEL_TOKEN_SOURCE.cancel('RouteChange');
  generateNewCancelTokenSource();
};

/* Refresh token */
// AxiosInstance.interceptors.response.use(
//   response => response,
//   async function (error) {
//     const originalRequest = error.config;

//     if (
//       error &&
//       error.response &&
//       error.response.status === API_CONFIG.RESULT_CODE_PUSH_OUT &&
//       !originalRequest._retry
//     ) {
//       // Bug that retry not set to true
//       originalRequest._retry = true;

//       if (!isAlreadyFetchingAccessToken) {
//         isAlreadyFetchingAccessToken = true;
//         handleRefreshToken()
//           .then(result => {
//             const data = result?.data;
//             console.log({ resultRefreshToken: result });

//             if (!result?.data?.accessToken) {
//               return Promise.reject(error);
//             }

// store.dispatch(
//   authActions.onSetAccessToken(data?.accessToken || ''),
// );
// setUserTokenAsync({
//   accessToken: data?.accessToken,
//   refreshToken: data?.refreshToken,
// });

//             // If using Bearer`Bearer ${newToken.accessToken}`;
//             originalRequest.headers[
//               TOKEN_KEY_HEADER
//             ] = `Bearer ${data?.accessToken}`;
//             return AxiosInstance(originalRequest);
//           })

//           .catch(() => {});
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// refresh token
// const handleRefreshToken =
//   async (): Promise<AxiosResponse<SignInResponseModel> | null> => {
//     const userTokenStorage = await getUserTokenAsync();

//     const body: ParamsNetwork['body'] = {
//       RefreshToken: userTokenStorage.refreshToken,
//     };

//     const headers: AxiosRequestConfig['headers'] = {
//       [CONTENT_TYPE]: 'application/json',
//       [TOKEN_KEY_HEADER]: `Bearer ${userTokenStorage?.accessToken}`,
//     };

//     return AxiosInstance({
//       headers,
//       data: body,
//       method: 'POST',
//       baseURL: Config?.API_URL,
//       url: refreshTokenUrl,
//     })
//       .then((res: AxiosResponse) => {
//         return res.data;
//       })
//       .catch((error: AxiosError<AxiosResponse<SignInResponseModel>> | null) => {
//         isAlreadyFetchingAccessToken = false;
//         if (error?.response) {
//           showAppAlert({
//             error: error.response,
//           });
//         }

//         return error?.response;
//       });
//   };

// base
async function Request<T = Record<string, unknown>>(
  config: AxiosRequestConfig & ParamsNetwork,
) {
  // const { accessToken } = store.getState().auth;

  const baseURL = config.baseUrl || Config?.API_URL;

  console.log('End Point /', `${baseURL}${config.url}`);

  const defaultConfig: AxiosRequestConfig = {
    baseURL: baseURL,
    timeout: API_CONFIG.TIME_OUT,
    headers: {
      // [CONTENT_TYPE]: 'application/json',
      // [TOKEN_KEY_HEADER]: accessToken ? `Bearer ${accessToken}` : '',
    },
  };

  return new Promise<T>((resolve, reject) => {
    AxiosInstance.request(
      StyleSheet.flatten([
        defaultConfig,
        config,
        { signal: config?.signal || abortController.current?.signal },
      ]),
    )
      .then((res: AxiosResponse<T>) => {
        return resolve(res.data);
      })

      .catch((exception: AxiosError<T>) => {
        let error;

        if (exception && exception.response) {
          error = exception.response;
        } else {
          error = 'Network Error';
          // Show message dialog
        }

        hideAppLoader();
        if (exception?.response?.status !== API_CONFIG.RESULT_CODE_PUSH_OUT) {
          // Show message dialog with force logout
          // showAppAlert({
          //   error: error,
          // });
        }

        reject(error);
      });
  });
}

// get
async function Get<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'GET'));
}

// post
async function Post<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'POST'));
}

// post FormData
async function PostFormData<T>(params: ParamsNetwork) {
  const headers: AxiosRequestConfig['headers'] = {
    [CONTENT_TYPE]: 'multipart/form-data',
  };
  return Request<T>(
    handleParameter<ParameterPostFormData>({ ...params, headers }, 'POST'),
  );
}

// put
async function Put<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'PUT'));
}

// delete
async function Delete<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'DELETE'));
}
export type NetWorkResponseType<T> = (
  params: ParamsNetwork,
) => Promise<ResponseBase<T> | null>;

export const NetWorkService = {
  Get,
  Post,
  Put,
  Delete,
  PostFormData,
  Request,
  finishPendingRequests,
};
