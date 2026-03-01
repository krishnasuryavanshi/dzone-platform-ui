import { FieldType, OptionsType } from '@dzone/shared-lib';
import { OptionsKeys } from '@dzone/shared-lib';
import { CampaignField, CampaignFormSection } from '../../lib/enums';
import { CampaignStepSectionsType } from '../../lib/types';
import {
  ViewCampaignPermissions,
  EditCampaignPermissions,
  CreateCampaignPermissions,
} from '@dzone/shared-lib';

export const CreateCampaignDelivery: CampaignStepSectionsType = [
  {
    key: CampaignFormSection.Terms,
    viewPermissions: [
      ViewCampaignPermissions.InvoicingTerm,
      ViewCampaignPermissions.PaymentTerm,
      ViewCampaignPermissions.Budget,
    ],
    fields: [
      {
        field: CampaignField.InvoicingTerm,
        fieldType: FieldType.Select,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.InvoicingTerm,
        rules: [{ required: true }],
        viewOrder: 1,
        permissions: {
          view: ViewCampaignPermissions.InvoicingTerm,
          edit: EditCampaignPermissions.InvoicingTerm,
          create: CreateCampaignPermissions.InvoicingTerm,
        },
      },
      {
        field: CampaignField.PaymentTerm,
        fieldType: FieldType.Select,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.PaymentTerm,
        rules: [{ required: true }],
        viewOrder: 2,
        permissions: {
          view: ViewCampaignPermissions.PaymentTerm,
          edit: EditCampaignPermissions.PaymentTerm,
          create: CreateCampaignPermissions.PaymentTerm,
        },
      },
      {
        field: CampaignField.Budget,
        fieldType: FieldType.Number,
        rules: [{ required: true }],
        viewOrder: 3,
        permissions: {
          view: ViewCampaignPermissions.Budget,
          edit: EditCampaignPermissions.Budget,
          create: CreateCampaignPermissions.Budget,
        },
      },
    ],
  },
  {
    key: CampaignFormSection.Delivery,
    viewPermissions: [
      ViewCampaignPermissions.DeliveryContact,
      ViewCampaignPermissions.DeliveryMethod,
      ViewCampaignPermissions.DeliveryDays,
    ],
    fields: [
      {
        field: CampaignField.DeliveryContact,
        fieldType: FieldType.TextArea,
        maxLength: 64000,
        viewOrder: 4,
        permissions: {
          view: ViewCampaignPermissions.DeliveryContact,
          edit: EditCampaignPermissions.DeliveryContact,
          create: CreateCampaignPermissions.DeliveryContact,
        },
      },
      {
        field: CampaignField.DeliveryMethod,
        fieldType: FieldType.Select,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.DeliveryMethod,
        viewOrder: 5,
        permissions: {
          view: ViewCampaignPermissions.DeliveryMethod,
          edit: EditCampaignPermissions.DeliveryMethod,
          create: CreateCampaignPermissions.DeliveryMethod,
        },
      },
      {
        field: CampaignField.DeliveryDays,
        fieldType: FieldType.Multiselect,
        optionsType: OptionsType.Dynamic,
        optionsKey: OptionsKeys.DeliveryDays,
        viewOrder: 6,
        permissions: {
          view: ViewCampaignPermissions.DeliveryDays,
          edit: EditCampaignPermissions.DeliveryDays,
          create: CreateCampaignPermissions.DeliveryDays,
        },
      },
    ],
  },
];
