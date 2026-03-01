import { FC, useEffect, useState } from 'react';
import { ILineItem } from '../../../lib/types';
import { CustomFieldsContainer } from './custom-fields-container';

interface ICustomFieldsContainerProps {
  lineItemDetails?: ILineItem;
}

export const CustomFieldsWrapper: FC<ICustomFieldsContainerProps> = ({
  lineItemDetails,
}) => {
  const [initialValues, setInitialValues] = useState<Record<string, any>>();

  useEffect(() => {
    let customFields: Record<string, any>[] = [];
    if (lineItemDetails?.customFields) {
      customFields = lineItemDetails.customFields.map((field) => {
        return {
          ...field,
          inclusion: field.inclusion?.split(',') || [],
          exclusion: field.exclusion?.split(',') || [],
        };
      });
    }
    setInitialValues({
      customFields,
      customFieldInstructions: lineItemDetails?.customFieldInstructions,
    });
  }, [lineItemDetails]);

  if (!initialValues) {
    return null;
  }

  return (
    <CustomFieldsContainer
      lineItemDetails={lineItemDetails}
      initialValues={initialValues}
    />
  );
};
