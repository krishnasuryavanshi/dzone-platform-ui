interface IInputRecordType {
  name: string;
  value: string;
  [key: string]: string;
}

interface IInputRecord extends Record<string, IInputRecordType[]> {}

export const getOptions = (records: IInputRecord[], childrenKey?: string) => {
  return records?.map(({ name: value, value: label, ...rest }) => {
    return {
      label,
      value,
      ...(childrenKey && {
        options: rest[childrenKey].map(({ name, value, type }) => ({
          value: `${name}#${type}`,
          label: value,
        })),
      }),
    };
  });
};
