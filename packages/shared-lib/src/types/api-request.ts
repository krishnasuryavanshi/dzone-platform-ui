import type { AxiosHeaders, ResponseType } from 'axios';
import { HttpMethod } from '../enums';

export interface IApiRequestConfig {
  method?: HttpMethod;
  data?: Record<string, unknown> | unknown[];
  headers?: AxiosHeaders;
  isAuthenticated?: boolean;
  apiHost?: string;
  apiVersion?: string;
  resource?: string;
  resourceId?: string;
  params?: Record<string, unknown> | URLSearchParams;
  url?: string;
  responseType?: ResponseType;
  includeResponseHeaders?: boolean;
  requestName?: string;
  logRequest?: boolean;
}

export interface IRequestConfig {
  method: HttpMethod;
  data?: Record<string, unknown> | unknown[];
  headers?: AxiosHeaders;
  params?: Record<string, unknown> | URLSearchParams;
  baseURL?: string;
  url: string;
  responseType?: ResponseType;
}
