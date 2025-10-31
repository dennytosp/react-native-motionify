import { AxiosRequestConfig } from 'axios';

export interface ParamsNetwork extends AxiosRequestConfig {
  url: string;
  params?: any;
  query?: any;
  path?: Record<string, string | number>;
  body?: any;
  baseUrl?: string;
}

export interface ResponseBase<T = any> {
  code: number;
  msg?: string | undefined | null;
  data?: T;
  status: boolean;
  results?: T;
}

export interface ErrorResponseBase<T = any> {
  code: number;
  msg?: string | undefined | null;
  data?: T;
  status: boolean;
  title?: string;
}

export type ParameterPostFormData = AxiosRequestConfig & ParamsNetwork;
