import { type FC, type ReactNode } from 'react';
import { Flex } from 'antd';
import { HtmlContent } from './html-content';

interface TextContentProps {
  data: string;
  children?: ReactNode;
  isUserInput?: boolean;
}

export const TextContent: FC<TextContentProps> = ({
  data,
  children,
  isUserInput = false,
}) => {
  return (
    <Flex vertical>
      {children && <Flex>{children}</Flex>}
      <HtmlContent htmlStr={data} isUserInput={isUserInput} />
    </Flex>
  );
};
