import type { ReactNode } from 'react';
import { FieldType, OptionsKeys, OptionsType } from '../enums';
import type { FormRule } from './uicomponents';

export interface IFormConfig<StepsType, SectionType, FieldNameType, RowType> {
  meta: {
    name: string;
    className: string;
    formLayout: string;
  };
  translation: string;
  steps: Record<
    StepsType extends string ? string : never,
    IStepSectionConfig<SectionType, FieldNameType, RowType>[]
  >;
}

export interface IStepSectionConfig<SectionType, FieldNameType, RowType> {
  key: SectionType;
  show?: boolean;
  showHeader?: false;
  fields: IFieldConfig<FieldNameType, RowType>[];
  viewPermissions?: string[];
}

export interface IPermissionsConfig {
  view?: string;
  edit?: string;
  create?: string;
}

export interface IFieldConfig<FieldNameType, RowType> {
  field: FieldNameType;
  fieldType?: FieldType;
  showHeader?: false;
  rules?: Partial<FormRule>[];
  maxLength?: number;
  disabled?: boolean;
  hidden?: boolean;
  optionsType?: OptionsType;
  optionsKey?: OptionsKeys;
  hasMultiselectSearch?: boolean;
  className?: string;
  format?: string;
  valuePropName?: string;
  uploadLabel?: string;
  dataIndex?: string;
  columnTranslationKey?: string;
  customHelpText?: string;
  showLabelInControl?: boolean;
  columnMetadata?: ColumnMetadata;
  columnOrder?: number;
  viewOrder?: number;
  viewField?: string;
  renderer?: <T>(value: T, row?: RowType, index?: number) => ReactNode | null;
  permissions?: IPermissionsConfig;
}

export interface ColumnMetadata {
  width?: number;
  ellipsis?: boolean;
  fixed?: 'left' | 'right';
  isDateFilter?: boolean;
  isSearchable?: boolean;
  isFilterable?: boolean;
  isMinLengthRequiredForSearch?: boolean;
}
