import { FC, useEffect, useState } from 'react';
import { Typography, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { ShowDetailsSectionFooterAction } from './show-details-section-footer-actions';
import { ShowItemFields } from './show-item-fields';
import { IShowItemDetailsProps } from '../../lib/types';

const { Text } = Typography;

export const ShowItemDetails: FC<IShowItemDetailsProps> = ({
  itemDetails,
  updateUrl,
  formConfig,
  summaryViewFields,
  pageLabel,
  type,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [updateLink, setUpdateLink] = useState('');

  useEffect(() => {
    if (itemDetails) {
      const updateItemLink = `${location.pathname}/${updateUrl}`;
      setUpdateLink(updateItemLink);
    }
  }, [itemDetails]);

  const handleCollapse = (collapsedState: boolean) => {
    setIsCollapsed(collapsedState);
  };

  return (
    <Flex vertical gap="0.75rem">
      <Text strong style={{ marginBottom: '0' }}>
        {t(pageLabel)}
      </Text>

      <Flex vertical>
        <ShowDetailsSectionFooterAction
          itemUuid={itemDetails?.id}
          marketerCode={itemDetails?.marketerCode || ''}
          formConfig={formConfig}
          type={type}
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          updateLink={updateLink}
        />
        <ShowItemFields
          itemDetails={itemDetails}
          formConfig={formConfig}
          isCollapsed={isCollapsed}
          summaryViewFields={summaryViewFields}
        />
      </Flex>
    </Flex>
  );
};
