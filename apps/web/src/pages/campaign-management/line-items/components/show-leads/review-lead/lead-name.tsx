import { Flex, Typography } from 'antd';
import { FC } from 'react';
import { LeadMetaRow } from './lead-meta-row';

const { Text, Link } = Typography;

interface ILeadNameProps {
  name: string;
  email: string;
  linkedinLink: string;
}

export const LeadName: FC<ILeadNameProps> = ({ name, email, linkedinLink }) => {
  return (
    <Flex style={{ flex: 1 }}>
      <LeadMetaRow className='lead-name' label={name}>
        <Text
          style={{ fontSize: '0.875rem', width: '15rem' }}
          underline
          ellipsis>
          {email}
        </Text>
        <Link
          style={{ fontSize: '0.875rem', width: '15rem' }}
          href={linkedinLink}
          target='_blank'
          ellipsis>
          {linkedinLink}
        </Link>
      </LeadMetaRow>
    </Flex>
  );
};
