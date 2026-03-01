import { FC, useEffect, useState } from 'react';
import { Flex, Select, Typography } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { useTranslation } from 'react-i18next';
import {
  ITemplateInfo,
  ITemplateRow,
} from '../../lib/types/template';
import { EditTemplateLink } from './edit-template-link';
import { fetchDeliveryTemplatesByMarketer } from '../../services';

const { Text } = Typography;

interface ITemplateDropdownProps {
  selectedTemplate: ITemplateInfo | null;
  onTemplateChange: (template: ITemplateInfo) => void;
  tenantCode?: string;
  lineItemId?: string;
}

export const TemplateDropdown: FC<ITemplateDropdownProps> = ({
  onTemplateChange,
  selectedTemplate,
  tenantCode,
  lineItemId,
}) => {
  const { t } = useTranslation();
  const [templateListOptions, setTemplateListOptions] = useState<
    DefaultOptionType[]
  >([]);
  const [templatesData, setTemplatesData] = useState<ITemplateRow[]>([]);

  useEffect(() => {
    if (tenantCode) {
      fetchTemplateList(tenantCode, lineItemId);
    }
  }, [tenantCode, lineItemId]);

  const fetchTemplateList = async (tenantCode: string, lineItemId?: string) => {
    const data = await fetchDeliveryTemplatesByMarketer(tenantCode, lineItemId);
    if (data) {
      setTemplatesData(data?.data);
      setTemplateListOptions(
        data?.data?.map((item: ITemplateRow) => ({
          value: item.id,
          label: item.name,
        })),
      );
    }
  };

  const isTemplateSelected = Boolean(selectedTemplate);

  const filterTemplateOptions = (
    input: string,
    option: DefaultOptionType | undefined,
  ) => {
    if (!option || input.length < 3) {
      return false;
    }

    const label = option.label;
    if (typeof label === 'string') {
      return label.toLowerCase().includes(input.toLowerCase());
    }

    return false;
  };

  const handleSelectTemplate = (selectedId?: string) => {
    if (selectedId !== undefined) {
      const fullTemplate = templatesData.find(
        (template) => template.id === selectedId,
      );
      if (fullTemplate) {
        onTemplateChange(fullTemplate);
      }
    }
  };

  return (
    <Flex vertical style={{ width: '100%' }}>
      <Flex
        justify='space-between'
        align='center'
        style={{ marginBottom: '0.5rem' }}>
        <Text style={{ fontWeight: 'bold' }}>
          {t('Delivery Template')}
        </Text>
        <EditTemplateLink
          isTemplateSelected={isTemplateSelected}
          selectedTemplate={selectedTemplate}
        />
      </Flex>
      <Select
        className='select-template-name'
        style={{ width: '100%', height: '3rem' }}
        showSearch={true}
        placeholder='Select a Template'
        options={templateListOptions}
        value={selectedTemplate?.id}
        onChange={(selectedId: string) => handleSelectTemplate(selectedId)}
        filterOption={filterTemplateOptions}
      />
    </Flex>
  );
};
