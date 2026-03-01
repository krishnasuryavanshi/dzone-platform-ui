import { type FC } from 'react';
import { Avatar, Flex, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Hideable, MapFunction } from '@dzone/shared-ui';
import { UserMessageViewEnum } from '../../../lib/enums';
import { UserTextContent } from './view-messages/text-content';
import { UserFilesContent } from './view-messages/files-content';
import { UserCustomQuestionsContent } from './view-messages/custom-questions-content';
import { UserCustomFieldsContent } from './view-messages/custom-fields-content';

const { Text } = Typography;

type DzRecord = Record<string, any>;

interface UserMessageViewProps {
  message: DzRecord;
}

export const UserMessageView: FC<UserMessageViewProps> = ({ message }) => {
  const userText = message?.userMessage;
  const fields = message?.fields || [];

  return (
    <Flex gap="0.75rem" align="flex-start" justify="flex-end">
      <Flex
        vertical
        gap="0.25rem"
        style={{
          backgroundColor: '#235AED',
          color: '#fff',
          borderRadius: '0.75rem 0.75rem 0 0.75rem',
          padding: '0.75rem 1rem',
          maxWidth: '70%',
        }}
      >
        <Hideable show={!!userText}>
          <Text style={{ fontSize: '0.875rem', color: '#fff' }}>
            {userText}
          </Text>
        </Hideable>
        <MapFunction
          items={fields}
          renderItem={(field: DzRecord, index: number) => {
            const label = (
              <Hideable show={!!field.name}>
                <Text strong style={{ fontSize: '0.875rem', color: '#fff' }}>
                  {field.name}
                </Text>
              </Hideable>
            );

            switch (field.type) {
              case UserMessageViewEnum.Text:
              case UserMessageViewEnum.Radio:
              case UserMessageViewEnum.SinglePicklist:
              case UserMessageViewEnum.MultiPicklist:
              case UserMessageViewEnum.Date:
              case UserMessageViewEnum.Daterange:
              case UserMessageViewEnum.Checkbox:
              case UserMessageViewEnum.CustomRangeOptionsPicklist:
              case UserMessageViewEnum.Actions:
                return (
                  <UserTextContent key={index} data={field.data}>
                    {label}
                  </UserTextContent>
                );
              case UserMessageViewEnum.Files:
              case UserMessageViewEnum.MultiFileUpload:
              case UserMessageViewEnum.SingleFileUpload:
                return (
                  <UserFilesContent key={index} files={field.data || []}>
                    {label}
                  </UserFilesContent>
                );
              case UserMessageViewEnum.CustomQuestions:
                return (
                  <UserCustomQuestionsContent
                    key={index}
                    customQuestions={field.data || []}
                  >
                    {label}
                  </UserCustomQuestionsContent>
                );
              case UserMessageViewEnum.CustomFields:
                return (
                  <UserCustomFieldsContent key={index} data={field.data}>
                    {label}
                  </UserCustomFieldsContent>
                );
              default:
                return null;
            }
          }}
        />
      </Flex>
      <Avatar
        size={32}
        icon={<UserOutlined />}
        style={{ flexShrink: 0 }}
      />
    </Flex>
  );
};
