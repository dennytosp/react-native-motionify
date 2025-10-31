import i18n from '@/translations/i18n';
import { API_CONFIG } from './config';
import { ErrorResponseBase } from './types';

interface ErrorApiBase extends Error {
  title: string;
}

const handleData = (responseError: ErrorResponseBase<null>) => {
  return responseError;
};

const handleErrorApi = (status: number, data: ErrorApiBase | null) => {
  if (status === API_CONFIG.RESULT_CODE_PUSH_OUT) {
    return handleData({
      code: status,
      msg: data?.message ?? i18n.t('error.401'),
      data: null,
      status: false,
    });
  }

  const message =
    data?.message || i18n.t('dialog.theSystemHasEncounteredAnError');

  switch (status) {
    case API_CONFIG.ERROR_NETWORK_CODE:
      return handleData({
        code: API_CONFIG.ERROR_NETWORK_CODE,
        title: i18n.t('error.errorNetwork') || '',
        msg: i18n.t('error.contentNoInternet'),
        data: null,
        status: false,
      });

    case API_CONFIG.ERROR_NOT_FOUND:
      return handleData({
        code: status,
        title: data?.title,
        msg: i18n.t('error.400'),
        data: null,
        status: false,
      });

    case API_CONFIG.FORBIDDEN:
      return handleData({
        code: API_CONFIG.FORBIDDEN,
        title: data?.title || '',
        msg: message,
        data: null,
        status: false,
      });

    default:
      return handleData({
        code: status,
        title: data?.title,
        msg: message,
        data: null,
        status: false,
      });
  }
};

export { handleErrorApi };
