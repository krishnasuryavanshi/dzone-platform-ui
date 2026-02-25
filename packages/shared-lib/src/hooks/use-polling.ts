import { useEffect, useState } from 'react';

const DefaultPollingWaitTime = 30;

export interface IPollingDetails {
  isPolling: boolean;
  pollWaitTime: number;
  pollFunction: null | ((...args: any[]) => Promise<any>);
  pollFunctionArgs: null | Record<string, any>;
}

export function usePolling<T>() {
  const [pollingResult, setPollingResult] = useState<T>();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>();

  const [pollingDetails, setPollingDetails] = useState<IPollingDetails>({
    isPolling: false,
    pollWaitTime: DefaultPollingWaitTime,
    pollFunction: null,
    pollFunctionArgs: null,
  });

  useEffect(() => {
    if (pollingDetails.isPolling) {
      const { pollFunction, pollFunctionArgs } = pollingDetails;
      if (pollFunction) {
        if (timer) {
          clearTimeout(timer);
        }
        setTimer(
          setTimeout(
            async () => {
              const result = await pollFunction(pollFunctionArgs);
              setPollingResult(result);
            },
            (pollingDetails.pollWaitTime || DefaultPollingWaitTime) * 1000,
          ),
        );
      }
    } else {
      if (timer) {
        clearTimeout(timer);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [pollingDetails]);

  const updatePollingDetails = (pollingInfo: {
    pollWaitTime?: number;
    pollFunction: null | ((...args: any[]) => Promise<any>);
    pollFunctionArgs: null | Record<string, any>;
  }) => {
    const pollingObj = {
      ...pollingDetails,
      ...pollingInfo,
    };
    setPollingDetails(pollingObj);
  };

  const stopPolling = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  const startPolling = () => {
    setPollingDetails({
      ...pollingDetails,
      isPolling: true,
    });
  };

  return {
    updatePollingDetails,
    stopPolling,
    startPolling,
    pollingResult,
  };
}
