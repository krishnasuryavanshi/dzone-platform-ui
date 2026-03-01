import { type FC, type CSSProperties } from 'react';
import { Col, Flex, Row } from 'antd';
import { DzentSidebar } from './dzent-sidebar';
import { ChatWidgetContainer } from './chat-widget/chat-widget-container';

const CommonStyles: CSSProperties = {
  height: '100%',
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: '0.5rem',
};

export const DzentWrapper: FC = () => {
  return (
    <Flex style={{ height: '100%' }}>
      <Row gutter={[10, 10]} style={{ height: '100%', width: '100%' }}>
        <Col xs={0} sm={0} md={8} xl={6}>
          <DzentSidebar />
        </Col>
        <Col xs={24} sm={24} md={16} xl={18}>
          <Flex style={CommonStyles}>
            <ChatWidgetContainer />
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};
