import { type FC } from 'react';
import { MapFunction } from '@dzone/shared-ui';
import { FieldInfoList } from './field-info-list';
import { FieldDescriptionText } from './field-description-text';
import { FieldNote } from './field-note';

export const FieldAdditionalContent: FC<{ config: Record<string, any>[] }> = ({
  config,
}) => {
  const renderItem = (item: Record<string, any>, index: number) => {
    switch (item.type) {
      case 'ordered_list':
      case 'unordered_list':
        return <FieldInfoList key={index} config={item} />;
      case 'text':
        return <FieldDescriptionText key={index} config={item} />;
      case 'note':
        return <FieldNote key={index} config={item} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingTop: '0.5rem' }}>
      <MapFunction items={config} renderItem={renderItem} />
    </div>
  );
};
