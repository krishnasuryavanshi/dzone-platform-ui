import { FC } from 'react';
import { AddQuestionButton } from './add-question-button';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { QuestionRow } from './question-row';

const { List: FormList } = Form;

interface ChildField {
  field: string;
  fieldType: string;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  rules?: any[];
  showLabel?: boolean;
  hidden?: boolean;
}

interface ICustomQuestionsProps {
  form: FormInstance;
  customProps?: {
    childrenFields: ChildField[];
    disabled?: boolean;
    lists?: any;
    transKey?: string;
  };
}

export const CustomQuestions: FC<ICustomQuestionsProps> = ({
  form,
  customProps,
}) => {
  return (
    <FormList name='customQuestions'>
      {(fields, { add, remove }) => (
        <>
          <AddQuestionButton add={add} />

          {fields.map(({ key, name, ...restField }, index) => {
            const srNo = index + 1;

            return (
              <QuestionRow
                key={key}
                field={name}
                restField={{ ...restField, srNo }}
                restProps={{ form, remove, ...customProps }}
              />
            );
          })}
        </>
      )}
    </FormList>
  );
};
