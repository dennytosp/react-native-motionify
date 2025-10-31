import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { createRef } from 'react';
import { API_CONFIG } from './config';
import { handleErrorApi } from './error';
import { ErrorResponseBase, ResponseBase, ParamsNetwork } from './types';
import { translate } from '@/translations/translate';

const responseDefault: ErrorResponseBase<Record<string, unknown>> = {
  code: -500,
  status: false,
  msg: translate('error.haveError'),
};

export const onPushLogout = async () => {
  // logout()
  /**
   * do something when logout
   */
};

const abortController = createRef<AbortController>();
// @ts-ignore
// init abortController
abortController.current = new AbortController();

const cancelAllRequest = () => {
  abortController.current?.abort();

  // reset abortController, if not. all request cannot execute
  // because old abortController was aborted
  /* @ts-ignore  */
  abortController.current = new AbortController();
};

const handleResponseAxios = <T = Record<string, unknown>>(
  res: AxiosResponse<T>,
): ResponseBase<T> => {
  if (res.data) {
    return { code: API_CONFIG.CODE_SUCCESS, status: true, data: res.data };
  }

  return responseDefault as ResponseBase<T>;
};

const handleErrorAxios = <T = Record<string, unknown>>(
  error: AxiosError,
): ResponseBase<T> => {
  if (error.code === API_CONFIG.STATUS_TIME_OUT) {
    // timeout
    return handleErrorApi(
      API_CONFIG.CODE_TIME_OUT,
      null,
    ) as unknown as ResponseBase<T>;
  }

  if (error.response) {
    if (error.response.status === API_CONFIG.RESULT_CODE_PUSH_OUT) {
      return handleErrorApi(
        API_CONFIG.RESULT_CODE_PUSH_OUT,
        null,
      ) as unknown as ResponseBase<T>;
    } else {
      return handleErrorApi(
        error.response.status,
        null,
      ) as unknown as ResponseBase<T>;
    }
  }

  return handleErrorApi(
    API_CONFIG.ERROR_NETWORK_CODE,
    null,
  ) as unknown as ResponseBase<T>;
};

const handlePath = (url: string, path: ParamsNetwork['path']) => {
  if (!path || Object.keys(path).length <= 0) {
    return url;
  }

  let resUrl = url;

  Object.keys(path).forEach(k => {
    resUrl = resUrl.replaceAll(`{${k}}`, String(path[k]));
    resUrl = resUrl.replaceAll(`:${k}`, String(path[k]));
  });

  return resUrl;
};

const handleParameter = <T extends ParamsNetwork>(
  props: T,
  method: Method,
): AxiosRequestConfig & ParamsNetwork => {
  const { url, body, params, baseUrl } = props;

  return {
    ...props,
    method,
    url,
    data: body,
    params,
    baseUrl,
  };
};

export {
  abortController,
  cancelAllRequest,
  handleErrorAxios,
  handleParameter,
  handlePath,
  handleResponseAxios,
};
