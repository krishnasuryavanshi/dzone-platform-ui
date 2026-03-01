import { t } from 'i18next';

interface Rule {
  required?: boolean;
  characterLimit?: number;
  specialCharactersAllowed?: boolean;
  leadingTrailingSpaceAllowed?: boolean;
}

export function validationRules(
  rules: Rule[],
  key: string,
  transKey: string,
): any[] {
  return rules?.map((rule: any) => {
    let ruleOb = { ...rule };
    if (ruleOb.hasOwnProperty('required')) {
      ruleOb.message = t(`${transKey}.${key}.requiredValidationError`);
    }
    if (ruleOb.hasOwnProperty('pattern')) {
      ruleOb.message = t(`${transKey}.${key}.patternValidationError`);
    }
    if (ruleOb.hasOwnProperty('customValidator')) {
      ruleOb = ruleOb.customValidator;
    }
    return ruleOb;
  });
}
