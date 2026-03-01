import { ReactNode } from 'react';
import { last } from 'lodash-es';

export function createColumn<T>(
  hasFilters?: boolean,
) {
  return (
    name: string,
    dataIndex: string,
    extra?: Record<string, any> | null,
    renderer?: (value: any, record: T, index: number) => ReactNode,
  ) => {
    const nestedDataIndexes = dataIndex?.split('.');
    const key = last(nestedDataIndexes);

    if (hasFilters !== true) {
      extra = {
        ...extra,
        filters: null,
      };
    }

    return {
      title: name,
      dataIndex: nestedDataIndexes?.length > 1 ? nestedDataIndexes : dataIndex,
      key,
      render: renderer,
      width: extra?.filterIcon ? 250 : 200,
      ...extra,
    };
  };
}
