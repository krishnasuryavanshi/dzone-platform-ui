import { Routes, Route, useParams } from 'react-router';
import { ValidationSettingListContainer } from './components/list/validation-setting-list-container';
import { CreateValidationSettingContainer } from './components/form/create-validation-setting-container';

export default function LeadValidationPage() {
  return (
    <Routes>
      <Route index element={<ValidationSettingListContainer />} />
      <Route
        path="create"
        element={<CreateValidationSettingContainer isEditing={false} />}
      />
      <Route
        path="organizations/:tenantCode/settings/:settingId"
        element={<EditOrganizationSetting />}
      />
      <Route
        path="line-items/:lineItemId/settings/:settingId"
        element={<EditLineItemSetting />}
      />
    </Routes>
  );
}

function EditOrganizationSetting() {
  const params = useParams();
  return (
    <CreateValidationSettingContainer
      isEditing
      tenantCode={params.tenantCode}
      leadValidationSettingId={params.settingId}
    />
  );
}

function EditLineItemSetting() {
  const params = useParams();
  return (
    <CreateValidationSettingContainer
      isEditing
      lineItemId={params.lineItemId}
      leadValidationSettingId={params.settingId}
    />
  );
}
