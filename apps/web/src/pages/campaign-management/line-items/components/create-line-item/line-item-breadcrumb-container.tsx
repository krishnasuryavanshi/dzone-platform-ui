import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex } from 'antd';
import {
  ICreateLineItemBreadcrumbsProps,
  LineItemBreadcrumbs,
} from './line-item-breadcrumbs';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { DZONE_CLR_GRAY_DARK } from '@dzone/shared-lib';

interface LineItemBreadCrumbContainer extends ICreateLineItemBreadcrumbsProps {}

export const LineItemBreadCrumbContainer: FC<LineItemBreadCrumbContainer> = ({
  campaignData,
  id,
  lineItemId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const backToListPage = () => {
    navigate('/campaign-management/line-items');
  };
  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
      <LineItemBreadcrumbs {...{ campaignData, id, lineItemId }} />
      <Flex gap='0.5rem' align='center'>
        <Flex
          onClick={backToListPage}
          align='center'
          justify='center'
          style={{
            borderRadius: '1rem',
            background: DZONE_CLR_GRAY_DARK,
            height: '1.5rem',
            width: '1.5rem',
            cursor: 'pointer',
            paddingTop: '0.25rem',
          }}>
          <ArrowLeftOutlined style={{ color: '#fff', fontSize: '0.75rem' }} />
        </Flex>
        {id ? (
          <strong>
            {t('form.editLineItem.edit')}
          </strong>
        ) : (
          <strong>
            {t('form.createLineItem.create')}
          </strong>
        )}
      </Flex>
    </Flex>
  );
};
