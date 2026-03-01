import { FieldType, OptionsType } from '@dzone/shared-lib';
import { OptionsKeys } from '@dzone/shared-lib';
import { ReactNode } from 'react';
import { assignedToNamesRenderer } from '../../../lib/utils/renderers';
import { CampaignField, CampaignFormSection } from '../../lib/enums';
import { CampaignStepSectionsType } from '../../lib/types';
import {
  ViewCampaignPermissions,
  EditCampaignPermissions,
  CreateCampaignPermissions,
} from '@dzone/shared-lib';

export const CreateCampaignCollaborators: CampaignStepSectionsType = [
  {
    key: CampaignFormSection.Collaborators,
    viewPermissions: [
      ViewCampaignPermissions.CustomerSuccessManager,
      ViewCampaignPermissions.CustomerSuccessRep,
      ViewCampaignPermissions.OperationsManager,
      ViewCampaignPermissions.QaManager,
      ViewCampaignPermissions.QaTeamLeader,
      ViewCampaignPermissions.DeliveryManager,
      ViewCampaignPermissions.MisTeamLeader,
      ViewCampaignPermissions.CcdTeamLeader,
      ViewCampaignPermissions.AssignedTo,
    ],
    fields: [
      {
        field: CampaignField.CustomerSuccessManager,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.CustomerSuccessManager,
        disabled: true,
        viewOrder: 1,
        viewField: 'collaborators.customerSuccessManager',
        permissions: {
          view: ViewCampaignPermissions.CustomerSuccessManager,
          edit: EditCampaignPermissions.CustomerSuccessManager,
          create: CreateCampaignPermissions.CustomerSuccessManager,
        },
      },
      {
        field: CampaignField.CustomerSuccessRep,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.CustomerSuccessRep,
        disabled: true,
        viewOrder: 2,
        viewField: 'collaborators.customerSuccessRep',
        permissions: {
          view: ViewCampaignPermissions.CustomerSuccessRep,
          edit: EditCampaignPermissions.CustomerSuccessRep,
          create: CreateCampaignPermissions.CustomerSuccessRep,
        },
      },
      {
        field: CampaignField.OperationsManager,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.OperationsManager,
        disabled: true,
        viewOrder: 3,
        viewField: 'collaborators.operationsManager',
        permissions: {
          view: ViewCampaignPermissions.OperationsManager,
          edit: EditCampaignPermissions.OperationsManager,
          create: CreateCampaignPermissions.OperationsManager,
        },
      },
      {
        field: CampaignField.QaManager,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.QAManager,
        disabled: true,
        viewOrder: 4,
        viewField: 'collaborators.qaManager',
        permissions: {
          view: ViewCampaignPermissions.QaManager,
          edit: EditCampaignPermissions.QaManager,
          create: CreateCampaignPermissions.QaManager,
        },
      },
      {
        field: CampaignField.QaTeamLeader,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.QATeamLeader,
        disabled: true,
        viewOrder: 5,
        viewField: 'collaborators.qaTeamLeader',
        permissions: {
          view: ViewCampaignPermissions.QaTeamLeader,
          edit: EditCampaignPermissions.QaTeamLeader,
          create: CreateCampaignPermissions.QaTeamLeader,
        },
      },

      {
        field: CampaignField.DeliveryManager,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.DeliveryManager,
        disabled: true,
        viewOrder: 6,
        viewField: 'collaborators.deliveryManager',
        permissions: {
          view: ViewCampaignPermissions.DeliveryManager,
          edit: EditCampaignPermissions.DeliveryManager,
          create: CreateCampaignPermissions.DeliveryManager,
        },
      },
      {
        field: CampaignField.MisTeamLeader,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.MISTeamLeader,
        disabled: true,
        viewOrder: 7,
        viewField: 'collaborators.misTeamLeader',
        permissions: {
          view: ViewCampaignPermissions.MisTeamLeader,
          edit: EditCampaignPermissions.MisTeamLeader,
          create: CreateCampaignPermissions.MisTeamLeader,
        },
      },
      {
        field: CampaignField.CcdTeamLeader,
        fieldType: FieldType.SearchableSelect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.CCDTeamLeader,
        disabled: true,
        viewOrder: 8,
        viewField: 'collaborators.ccdTeamLeader',
        permissions: {
          view: ViewCampaignPermissions.CcdTeamLeader,
          edit: EditCampaignPermissions.CcdTeamLeader,
          create: CreateCampaignPermissions.CcdTeamLeader,
        },
      },
      {
        field: CampaignField.AssignedTo,
        fieldType: FieldType.Multiselect,
        rules: [{ required: true }],
        optionsType: OptionsType.Dynamic,
        hasMultiselectSearch: true,
        optionsKey: OptionsKeys.AssignedTo,
        dataIndex: 'collaborators.assignedTo',
        columnMetadata: { ellipsis: true, width: 300, isFilterable: true },
        renderer: assignedToNamesRenderer as () => ReactNode,
        columnOrder: 12,
        viewOrder: 9,
        viewField: 'collaborators.assignedTo',
        permissions: {
          view: ViewCampaignPermissions.AssignedTo,
          edit: EditCampaignPermissions.AssignedTo,
          create: CreateCampaignPermissions.AssignedTo,
        },
      },
    ],
  },
];
