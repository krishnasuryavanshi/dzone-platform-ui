import { FieldType, OptionsKeys, OptionsType } from '@dzone/shared-lib';
import { ReactNode } from 'react';
import { assignedToNamesRenderer } from '../../../lib/utils/renderers';
import { LineItemFields, LineItemSections } from '../../lib/enums';
import { LineItemStepSectionsType } from '../../lib/types';
import {
  CreateLineItemPermissions,
  EditLineItemPermissions,
  ViewLineItemPermissions,
} from '@dzone/shared-lib';

export const CollaboratorsConfig: LineItemStepSectionsType = [
  {
    key: LineItemSections.Collaborators,
    viewPermissions: [
      ViewLineItemPermissions.CustomerSuccessManager,
      ViewLineItemPermissions.CustomerSuccessRep,
      ViewLineItemPermissions.OperationsManager,
      ViewLineItemPermissions.QaManager,
      ViewLineItemPermissions.QaTeamLead,
      ViewLineItemPermissions.DeliveryManager,
      ViewLineItemPermissions.MisTeamLeader,
      ViewLineItemPermissions.CcdTeamLeader,
      ViewLineItemPermissions.AssignedTo,
    ],
    fields: [
      {
        field: LineItemFields.CustomerSuccessManager,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 1,
        viewField: 'collaborators.customerSuccessManager',
        permissions: {
          view: ViewLineItemPermissions.CustomerSuccessManager,
          edit: EditLineItemPermissions.CustomerSuccessManager,
          create: CreateLineItemPermissions.CustomerSuccessManager,
        },
      },
      {
        field: LineItemFields.CustomerSuccessManagerId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.CustomerSuccessRep,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 2,
        viewField: 'collaborators.customerSuccessRep',
        permissions: {
          view: ViewLineItemPermissions.CustomerSuccessRep,
          edit: EditLineItemPermissions.CustomerSuccessRep,
          create: CreateLineItemPermissions.CustomerSuccessRep,
        },
      },
      {
        field: LineItemFields.CustomerSuccessRepId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.OperationsManager,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 3,
        viewField: 'collaborators.operationsManager',
        permissions: {
          view: ViewLineItemPermissions.OperationsManager,
          edit: EditLineItemPermissions.OperationsManager,
          create: CreateLineItemPermissions.OperationsManager,
        },
      },
      {
        field: LineItemFields.OperationsManagerId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.QAManager,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 4,
        viewField: 'collaborators.qaManager',
        permissions: {
          view: ViewLineItemPermissions.QaManager,
          edit: EditLineItemPermissions.QaManager,
          create: CreateLineItemPermissions.QaManager,
        },
      },
      {
        field: LineItemFields.QAManagerId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.QATeamLead,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 5,
        viewField: 'collaborators.qaTeamLeader',
        permissions: {
          view: ViewLineItemPermissions.QaTeamLead,
          edit: EditLineItemPermissions.QaTeamLead,
          create: CreateLineItemPermissions.QaTeamLead,
        },
      },
      {
        field: LineItemFields.QATeamLeadId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.DeliveryManager,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 6,
        viewField: 'collaborators.deliveryManager',
        permissions: {
          view: ViewLineItemPermissions.DeliveryManager,
          edit: EditLineItemPermissions.DeliveryManager,
          create: CreateLineItemPermissions.DeliveryManager,
        },
      },
      {
        field: LineItemFields.DeliveryManagerId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.MISTeamLeader,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 7,
        viewField: 'collaborators.misTeamLeader',
        permissions: {
          view: ViewLineItemPermissions.MisTeamLeader,
          edit: EditLineItemPermissions.MisTeamLeader,
          create: CreateLineItemPermissions.MisTeamLeader,
        },
      },
      {
        field: LineItemFields.MISTeamLeaderId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.CCDTeamLeader,
        fieldType: FieldType.Text,
        disabled: true,
        viewOrder: 8,
        viewField: 'collaborators.ccdTeamLeader',
        permissions: {
          view: ViewLineItemPermissions.CcdTeamLeader,
          edit: EditLineItemPermissions.CcdTeamLeader,
          create: CreateLineItemPermissions.CcdTeamLeader,
        },
      },
      {
        field: LineItemFields.CCDTeamLeaderId,
        fieldType: FieldType.Text,
        hidden: true,
      },
      {
        field: LineItemFields.AssignedTo,
        fieldType: FieldType.Multiselect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.AssignedTo,
        hasMultiselectSearch: true,
        dataIndex: 'collaborators.assignedTo',
        columnMetadata: { ellipsis: true, width: 300, isFilterable: true },
        renderer: assignedToNamesRenderer as () => ReactNode,
        columnOrder: 15,
        viewOrder: 8,
        viewField: 'collaborators.assignedTo',
        permissions: {
          view: ViewLineItemPermissions.AssignedTo,
          edit: EditLineItemPermissions.AssignedTo,
          create: CreateLineItemPermissions.AssignedTo,
        },
      },
    ],
  },
];
