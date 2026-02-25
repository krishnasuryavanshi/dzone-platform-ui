import React from 'react';
import { NoData } from './no-data';

export interface IMapFunctionProps<T> {
  items: T[];
  renderItem: (item: T, index: number, restProps?: Record<string, any>) => React.ReactNode;
  restProps?: Record<string, any>;
}

export function MapFunction<T>({ items, renderItem, restProps }: IMapFunctionProps<T>) {
  if (!items) return null;
  if (items.length === 0) return <NoData />;

  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>{renderItem(item, index, restProps)}</React.Fragment>
      ))}
    </>
  );
}
