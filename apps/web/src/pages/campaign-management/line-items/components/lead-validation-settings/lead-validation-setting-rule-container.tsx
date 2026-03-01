import {
  DuplicationCheck,
  MandatoryValidations,
  SingleSectionSingleValue,
  SyntaxValidation,
  Targeting,
} from './show-rule';

type LeadValidationSettingRuleContainerProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const LeadValidationSettingRuleContainer = ({
  ruleName,
  isEditing,
}: LeadValidationSettingRuleContainerProps) => {
  switch (ruleName) {
    case 'TARGETING':
      return <Targeting ruleName={ruleName} isEditing={isEditing} />;
    case 'MANDATORY_VALIDATION':
      return <MandatoryValidations ruleName={ruleName} isEditing={isEditing} />;
    case 'DUPLICATE_VALIDATION':
      return <DuplicationCheck ruleName={ruleName} isEditing={isEditing} />;
    case 'SYNTAX_VALIDATION':
      return <SyntaxValidation ruleName={ruleName} isEditing={isEditing} />;
    default:
      return (
        <SingleSectionSingleValue ruleName={ruleName} isEditing={isEditing} />
      );
  }
};
