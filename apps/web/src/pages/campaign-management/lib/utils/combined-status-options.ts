export const combinedStatusOptions = (statusList: any, record?: Record<string, any>) => {
  const currentStatus = statusList?.data?.find((status: any) => {
    return status?.name === record?.status?.name;
  });
  const promotionStatuses =
    currentStatus?.promotionStatuses.filter(
      (status: string) => status !== 'NA',
    ) || [];
  const demotionStatuses =
    currentStatus?.demotionStatuses.filter(
      (status: string) => status !== 'NA',
    ) || [];

  const createOptions = (
    statuses: string[],
    type: 'promotion' | 'demotion',
  ) => {
    return statuses
      .map((key) => {
        const status = statusList.data.find(
          (status: { key: string }) => status.key === key,
        );
        if (status) {
          const { title, description, positiveMessage, negativeMessage } =
            status;
          return {
            label: status.value,
            value: status.name,
            type,
            title,
            description,
            positiveMessage,
            negativeMessage,
          };
        }
        return null;
      })
      .filter(Boolean);
  };
  const promotionOptions = createOptions(promotionStatuses, 'promotion');
  const demotionOptions = createOptions(demotionStatuses, 'demotion');
  return [...promotionOptions, ...demotionOptions];
};
