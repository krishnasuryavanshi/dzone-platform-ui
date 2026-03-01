import { type FC, useState, useEffect, type KeyboardEvent } from 'react';
import { Button, Flex, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Hideable } from '@dzone/shared-ui';
import { useDzentStore } from '../../stores/use-dzent-store';
import { DefaultTextFieldName } from '../../lib/constants';

const { TextArea } = Input;

export const FooterContent: FC = () => {
  const {
    handleUserMessage,
    disableTextInput,
    footerInputPlaceholder,
    userPrefilledMessage,
    clearUserPrefilledMessage,
    systemMessage,
  } = useDzentStore();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (userPrefilledMessage) {
      setInputValue(userPrefilledMessage);
      clearUserPrefilledMessage();
    }
  }, [userPrefilledMessage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const fieldName =
      systemMessage?.[0]?.field?.name || DefaultTextFieldName;

    handleUserMessage({
      userMessage: inputValue.trim(),
      state: { [fieldName]: inputValue.trim() },
    });
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Flex
      gap="0.5rem"
      align="flex-end"
      style={{
        padding: '0.75rem 1rem',
        borderTop: '1px solid #f0f0f0',
      }}
    >
      <TextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={footerInputPlaceholder}
        disabled={disableTextInput}
        autoSize={{ minRows: 1, maxRows: 4 }}
        style={{ flex: 1, resize: 'none' }}
      />
      <Hideable show={!disableTextInput}>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputValue.trim()}
        />
      </Hideable>
    </Flex>
  );
};
