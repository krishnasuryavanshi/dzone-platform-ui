import {
  ServiceUnavailableCode,
  ServiceUnavailableStatus,
  ServiceUnavailableStatusText,
} from '../constants';

export function httpError(message: string, errorObject: any) {
  const { error, statusText, status } = errorObject;
  const errorMessageskey = Object.keys(error?.response?.data);
  let errorMessage = '';
  if (errorMessageskey.length) {
    errorMessage = error?.response?.data[errorMessageskey[0]];
  }
  if (!errorMessage) {
    errorMessage = message;
  }
  if (error?.code === ServiceUnavailableCode) {
    return {
      error: { message: ServiceUnavailableStatusText, error },
      status: {
        status: ServiceUnavailableStatus,
        statusText: ServiceUnavailableStatusText,
      },
    };
  } else {
    return { error: { message: errorMessage, error }, status: { statusText, status } };
  }
}
