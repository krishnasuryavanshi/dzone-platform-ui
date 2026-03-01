import { FC, ReactNode } from 'react';
import { Tooltip, Input, Flex } from 'antd';

interface RenderInputWithTooltipProps {
  value: any;
  tooltipTitle: string;
  style?: React.CSSProperties;
  suffix?: ReactNode;
}

export const RenderInputWithTooltip: FC<RenderInputWithTooltipProps> = ({
  value,
  tooltipTitle,
  style,
  suffix,
}) => {
  return (
    <Tooltip
      placement="bottom"
      overlayStyle={{ whiteSpace: 'normal', maxWidth: '18.75rem' }}
      overlayInnerStyle={{
        fontSize: '0.75rem',
        padding: '0.5rem',
        maxHeight: '7.5rem',
        overflowY: 'auto',
        wordBreak: 'break-word',
      }}
      title={tooltipTitle}
    >
      <Input
        disabled
        size="large"
        value={value}
        suffix={
          suffix && (
            <Flex justify="center" align="center" style={{ height: '100%' }}>
              {suffix}
            </Flex>
          )
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.875rem',
          background: '#fff',
          color: '#000',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          width: '100%',
          ...style,
        }}
      />
    </Tooltip>
  );
};
