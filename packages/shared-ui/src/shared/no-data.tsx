import { type FC } from 'react';
import { Result, Button } from '../components';

export interface INoDataProps {
  title?: string;
  subTitle?: string;
  handleRefresh?: () => void;
}

export const NoData: FC<INoDataProps> = ({
  title = 'No Data Available',
  subTitle = 'There is currently no data available.',
  handleRefresh,
}) => {
  return (
    <Result
      status="info"
      title={title}
      subTitle={subTitle}
      extra={
        handleRefresh ? (
          <Button type="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        ) : null
      }
    />
  );
};
