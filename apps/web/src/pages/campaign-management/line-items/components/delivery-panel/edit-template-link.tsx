import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DZONE_CLR_BLACK, CLR_GRAY } from '@dzone/shared-lib';
import { ITemplateInfo } from '../../lib/types/template';

const { Text } = Typography;

interface IEditTemplateLinkProps {
  isTemplateSelected: boolean;
  selectedTemplate: ITemplateInfo | null;
}

export const EditTemplateLink: React.FC<IEditTemplateLinkProps> = ({
  isTemplateSelected,
  selectedTemplate,
}) => {
  const { t } = useTranslation();
  const href = isTemplateSelected
    ? `/integrations-hub/templates/${selectedTemplate?.id}/update?id=${selectedTemplate?.templateId}`
    : '#';

  return (
    <Link
      to={href}
      style={{
        color: isTemplateSelected ? DZONE_CLR_BLACK : '#d9d9d9',
        cursor: isTemplateSelected ? 'pointer' : 'not-allowed',
        textDecoration: 'underline',
        height: '1.5rem',
        padding: '0',
        display: 'inline-block',
      }}
      target={isTemplateSelected ? '_blank' : undefined}
      rel={isTemplateSelected ? 'noopener noreferrer' : undefined}>
      <Text
        style={{
          color: isTemplateSelected ? `${DZONE_CLR_BLACK}` : `${CLR_GRAY}`,
        }}>
        {t('Edit Template')}
      </Text>
    </Link>
  );
};
