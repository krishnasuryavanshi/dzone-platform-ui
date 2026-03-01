import { IStepSectionConfig } from '@dzone/shared-lib';
import { LineItemFields, LineItemSections } from '../enums';
import { ILineItem } from './line-item';

export type LineItemStepSectionsType = IStepSectionConfig<
  LineItemSections,
  LineItemFields,
  ILineItem
>[];
