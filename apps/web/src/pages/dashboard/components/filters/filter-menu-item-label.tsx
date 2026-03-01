import { type FC } from 'react';
import { Flex, Typography, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface FilterMenuItemLabelProps {
  name: string;
  id?: string;
  all?: boolean;
  count?: number;
}

export const FilterMenuItemLabel: FC<FilterMenuItemLabelProps> = ({
  name,
  id,
  all,
  count,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip placement="right" title={t(name)} arrow={false}>
      <Flex vertical>
        <Text
          style={{ fontSize: '0.875rem', color: '#000', fontWeight: 400 }}
          ellipsis>
          {all && count ? (
            <Flex justify="space-between">
              <Text style={{ fontSize: '0.875rem', color: '#000', fontWeight: 400 }}>
                {t(name)}
              </Text>
              <Text style={{ fontSize: '0.875rem', color: '#000', fontWeight: 400 }}>
                {count}
              </Text>
            </Flex>
          ) : (
            t(name)
          )}
        </Text>
        {id && (
          <Text
            style={{ fontSize: '0.75rem', color: '#000', fontWeight: 300 }}
            ellipsis>
            {id}
          </Text>
        )}
      </Flex>
    </Tooltip>
  );
};
