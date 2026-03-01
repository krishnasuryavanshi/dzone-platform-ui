import { FC, ReactNode } from 'react';
import { Modal, Form } from 'antd';

interface IModalFormProps {
  open: boolean;
  handleCancel: () => void;
  formProps: any;
  extra?: ReactNode;
  children?: ReactNode;
}

/**
 * ModalForm - wraps a Form inside a Modal.
 * TODO: Fully migrate from dzone-ui with all features.
 */
export const ModalForm: FC<IModalFormProps> = ({
  open,
  handleCancel,
  formProps,
  extra,
  children,
}) => {
  const { form, onFinish, meta, ...headings } = formProps;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={headings?.title}
      footer={null}
      destroyOnClose
      width='50rem'
    >
      <Form form={form} onFinish={onFinish} {...meta} layout='vertical'>
        {extra}
        {children}
      </Form>
    </Modal>
  );
};
