export interface IValidationSettingRow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  tenant: { code: string; name: string; [key: string]: any };
  marketer: string | null;
}

export type ValidationSettingRuleSectionProps = {
  section: Record<string, any>;
  isDisabled: boolean;
};
