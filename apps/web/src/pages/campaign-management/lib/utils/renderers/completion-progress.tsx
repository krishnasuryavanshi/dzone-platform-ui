import { Progress } from 'antd';

const singleColor = '#5B8DEF';

export const completionProgressIndicator = (value: number) => {
  return (
    <Progress
      className='launch-progress'
      type='circle'
      percent={value}
      strokeColor={singleColor}
      size={30}
    />
  );
};
