import { Typography } from 'antd';
import { FC, useState } from 'react';
import { ICustomQuestion } from '../../lib/types';
import { ShowCustomQuestionsDrawer } from './show-custom-questions-drawer';

const { Link } = Typography;

interface IShowCustomQuestionsProps {
  label: string;
  value: ICustomQuestion[];
}

export const ShowCustomQuestions: FC<IShowCustomQuestionsProps> = ({
  label,
  value,
}) => {
  const [showModal, setShowModal] = useState(false);
  if (!value?.length) return null;
  return (
    <>
      <Link onClick={() => setShowModal(true)}>Show All</Link>
      <ShowCustomQuestionsDrawer
        label={label}
        show={showModal}
        questions={value}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};
