import { LineItemFields, LineItemSections } from '../enums';

interface User {
  label: string;
  value: string;
}

export const updateFormCollaboratorsValues = (
  data: Record<string, User[] | undefined>,
  patchFormValues: (values: any) => void,
  updateFormStepDetails: Function,
) => {
  const roleFormValues: Record<string, { field: string; idField: string }> = {
    customerSuccessManager: {
      field: LineItemFields.CustomerSuccessManager,
      idField: LineItemFields.CustomerSuccessManagerId,
    },
    customerSuccessRep: {
      field: LineItemFields.CustomerSuccessRep,
      idField: LineItemFields.CustomerSuccessRepId,
    },
    operationsManager: {
      field: LineItemFields.OperationsManager,
      idField: LineItemFields.OperationsManagerId,
    },
    qaManager: {
      field: LineItemFields.QAManager,
      idField: LineItemFields.QAManagerId,
    },
    qaTeamLeader: {
      field: LineItemFields.QATeamLead,
      idField: LineItemFields.QATeamLeadId,
    },
    deliveryManager: {
      field: LineItemFields.DeliveryManager,
      idField: LineItemFields.DeliveryManagerId,
    },
    misTeamLeader: {
      field: LineItemFields.MISTeamLeader,
      idField: LineItemFields.MISTeamLeaderId,
    },
    ccdTeamLeader: {
      field: LineItemFields.CCDTeamLeader,
      idField: LineItemFields.CCDTeamLeaderId,
    },
  };

  const clearedValues = Object.values(roleFormValues).reduce(
    (acc, { field, idField }) => ({
      ...acc,
      [field]: '',
      [idField]: '',
    }),
    {},
  );

  patchFormValues(clearedValues);

  const updates: Record<string, any> = {};

  Object.keys(data).forEach((role) => {
    const users = data[role as keyof typeof data];
    const formValues = roleFormValues[role as keyof typeof roleFormValues];

    if (users && formValues) {
      const ids = users.map((user) => user.value).join(', ');
      const label = users.map((user) => user.label).join(', ');

      updates[formValues.field] = label;
      if (ids) {
        updates[formValues.idField] = ids;
      }
    }
  });

  if (Object.keys(updates).length > 0) {
    patchFormValues(updates);
  }

  Object.values(roleFormValues).forEach(({ field }) => {
    updateFormStepDetails(LineItemSections.Collaborators, field, updates);
  });
};
