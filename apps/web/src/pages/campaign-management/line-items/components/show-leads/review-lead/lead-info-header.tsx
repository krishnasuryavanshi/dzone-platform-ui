import { Flex } from 'antd';
import { FC } from 'react';
import { LeadName } from './lead-name';
// TODO: Re-enable once AI validation is active
// import { AIValidationContainer } from './ai-validation-container';

interface ILeadInfoHeaderProps {
  name: string;
  email: string;
  linkedinLink: string;
}

export const LeadInfoHeader: FC<ILeadInfoHeaderProps> = ({
  name,
  email,
  linkedinLink,
}) => {
  return (
    <Flex gap={'1rem'} justify='space-between'>
      <LeadName name={name} email={email} linkedinLink={linkedinLink} />
      {/* <AIValidationContainer /> */}
    </Flex>
  );
};
