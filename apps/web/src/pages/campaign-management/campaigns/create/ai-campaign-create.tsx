import { useState } from 'react';
import { Flex, Button, Typography } from 'antd';
import { CloseOutlined, RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export const AiCampaignCreate = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleAICampaignCreationNavigation = () => {
    setIsOpen(false);
    navigate('/dzent');
  };

  return (
    <>
      {isOpen && (
        <div
          style={{
            right: 0,
            bottom: 0,
            position: 'fixed',
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '1px solid #235AED',
            borderRadius: '10px 10px 0 0',
            padding: '0.75rem',
            width: '40rem',
          }}
        >
          <Flex justify="space-between" gap="3rem">
            <Flex
              gap="0.75rem"
              style={{ paddingLeft: '0.5rem', paddingBlock: '0.75rem' }}
            >
              <div>
                <RobotOutlined style={{ fontSize: '1.5rem', color: '#235AED' }} />
              </div>
              <Flex vertical gap="1.25rem">
                <Flex>
                  <Text style={{ color: '#235AED', fontSize: '1.125rem' }}>
                    {t(
                      "Want to save time? Let AI create your campaign, just tell us what you need, and we'll take care of the rest.",
                    )}
                  </Text>
                </Flex>
                <Flex gap="0.5rem">
                  <Button
                    type="primary"
                    onClick={handleAICampaignCreationNavigation}
                    style={{ boxShadow: 'none' }}
                  >
                    {t('Yes, switch to AI Assistant')}
                  </Button>
                  <Button onClick={() => setIsOpen(false)}>
                    {t('No, I will continue manually')}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => setIsOpen(false)}
            >
              <CloseOutlined
                style={{ fontSize: '1.5rem', color: '#EDEDED' }}
              />
            </div>
          </Flex>
        </div>
      )}
    </>
  );
};
