import { FC } from 'react';
import { Typography, Flex } from 'antd';
import { RenderInputWithTooltip } from '../render-field-with-tooltip';

const { Text } = Typography;

interface CustomQuestionBlockProps {
  oldQuestions: any[];
  newQuestions: any[];
}

interface QuestionListProps {
  questions: any[];
  type: 'Old' | 'New';
}

const QuestionList: FC<QuestionListProps> = ({ questions, type }) => (
  <>
    <Text type="secondary" style={{ fontSize: '0.875rem' }}>
      Custom Questions ({type})
    </Text>
    {Array.isArray(questions) && questions.length > 0 ? (
      <Flex vertical gap={16}>
        {questions.map((q, i) => (
          <Flex key={i} vertical gap={8}>
            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
              Question ({type}):
            </Text>
            <RenderInputWithTooltip value={q.question || '—'} tooltipTitle={q.question || '—'} />
            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
              Accepted Answer ({type}):
            </Text>
            <RenderInputWithTooltip value={q.acceptedAnswer || '—'} tooltipTitle={q.acceptedAnswer || '—'} />
            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
              Rejected Answer ({type}):
            </Text>
            <RenderInputWithTooltip value={q.rejectedAnswer || '—'} tooltipTitle={q.rejectedAnswer || '—'} />
          </Flex>
        ))}
      </Flex>
    ) : (
      <Text type="secondary">—</Text>
    )}
  </>
);

export const CustomQuestionBlock: FC<CustomQuestionBlockProps> = ({
  oldQuestions,
  newQuestions,
}) => {
  return (
    <Flex gap={16} style={{ width: '100%' }}>
      <Flex vertical style={{ width: '48%' }}>
        <QuestionList questions={oldQuestions} type="Old" />
      </Flex>
      <Flex vertical style={{ width: '48%' }}>
        <QuestionList questions={newQuestions} type="New" />
      </Flex>
    </Flex>
  );
};
