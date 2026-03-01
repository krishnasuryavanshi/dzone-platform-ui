import { FieldType } from '@dzone/shared-lib';
import { CustomQuestions } from '../../components/create-line-item/custom-questions';
import { LineItemFields, LineItemSections } from '../../lib/enums';
import { ShowCustomQuestions } from '../../components/show-line-item';
import {
  ViewLineItemPermissions,
  EditLineItemPermissions,
  CreateLineItemPermissions,
} from '@dzone/shared-lib';

export const CustomQuestionsConfig: Record<string, any>[] = [
  {
    key: LineItemSections.CustomQuestions,
    viewPermissions: [ViewLineItemPermissions.CustomQuestions],
    fields: [
      {
        field: LineItemFields.HasCustomQuestions,
        fieldType: FieldType.Checkbox,
        showLabelInControl: true,
        valuePropName: 'checked',
        viewOrder: 1,
        permissions: {
          view: ViewLineItemPermissions.CustomQuestions,
          edit: EditLineItemPermissions.CustomQuestions,
          create: CreateLineItemPermissions.CustomQuestions,
        },
      },
      {
        field: LineItemFields.CustomQuestionInstructions,
        fieldType: FieldType.TextArea,
        maxLength: 64000,
        viewOrder: 2,
        permissions: {
          view: ViewLineItemPermissions.CustomQuestionInstructions,
          edit: EditLineItemPermissions.CustomQuestionInstructions,
          create: CreateLineItemPermissions.CustomQuestionInstructions,
        },
      },
    ],
  },
  {
    key: LineItemSections.CustomQuestions,
    showHeader: false,
    fields: [
      {
        field: LineItemFields.CustomQuestions,
        fieldType: FieldType.CustomComponent,
        component: CustomQuestions,
        viewComponent: ShowCustomQuestions,
        columnSpan: { span: 24 },
        viewOrder: 3,
        permissions: {
          view: ViewLineItemPermissions.CustomQuestions,
          edit: EditLineItemPermissions.CustomQuestions,
          create: CreateLineItemPermissions.CustomQuestions,
        },
        children: [
          {
            showLabel: false,
            field: LineItemFields.Question,
            fieldType: FieldType.TextArea,
            maxLength: 64000,
            rules: [{ required: true }],
            permissions: {
              view: ViewLineItemPermissions.CustomQuestion,
              edit: EditLineItemPermissions.CustomQuestion,
              create: CreateLineItemPermissions.CustomQuestion,
            },
          },
          {
            showLabel: false,
            field: LineItemFields.AcceptedAnswers,
            fieldType: FieldType.TextArea,
            maxLength: 64000,
            rules: [{ required: true }],
            permissions: {
              view: ViewLineItemPermissions.AcceptedAnswersToCustomQuestion,
              edit: EditLineItemPermissions.AcceptedAnswersToCustomQuestion,
              create: CreateLineItemPermissions.AcceptedAnswersToCustomQuestion,
            },
          },
          {
            showLabel: false,
            field: LineItemFields.RejectedAnswers,
            fieldType: FieldType.TextArea,
            maxLength: 64000,
            rules: [{ required: true }],
            permissions: {
              view: ViewLineItemPermissions.RejectedAnswersToCustomQuestion,
              edit: EditLineItemPermissions.RejectedAnswersToCustomQuestion,
              create: CreateLineItemPermissions.RejectedAnswersToCustomQuestion,
            },
          },
          {
            showLabel: false,
            field: LineItemFields.QuestionId,
            fieldType: FieldType.Text,
            hidden: true,
          },
        ],
      },
    ],
  },
];
