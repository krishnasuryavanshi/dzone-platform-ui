import { BasicTable } from '@dzone/shared-ui';
import { useScrollableTableHeight } from '@dzone/shared-lib';
import { cloneDeep } from 'lodash-es';
import { useNavigate } from 'react-router';
import { FC } from 'react';
import { useListColumns } from '../../lib/hooks';
import { useCampaignFilterOptions } from '../lib/hooks';
import { ICampaign } from '../lib/types';
import { generateCampaignLinks } from '../lib/utils';
import CampaignDetailsSchema from '../lib/schemas/campaign-form.json';

type Filters = Record<string, any>;

interface Props {
  campaigns: ICampaign[];
  hasFilters?: boolean;
  isDzoneUser?: boolean;
  filterInfo?: Filters;
  assignedTo: string;
  handleFiltersChange?: (filters: Filters) => void;
}

const StaticContentHeight = 216;

export const CampaignList: FC<Props> = ({
  campaigns,
  hasFilters,
  filterInfo,
  assignedTo,
  handleFiltersChange,
}) => {
  const navigate = useNavigate();
  const options = useCampaignFilterOptions(hasFilters, assignedTo);

  const columns = useListColumns(
    cloneDeep(CampaignDetailsSchema) as any[],
    hasFilters,
    filterInfo,
    options,
  );
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: ICampaign) => {
    const showCampaignLink = generateCampaignLinks(record);
    navigate(showCampaignLink);
  };

  const handleChange = ({ filters }: { filters: Filters }) => {
    handleFiltersChange && handleFiltersChange(filters);
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={campaigns}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record: any) => handleRowClick(record)}
      handleChange={handleChange}
    />
  );
};
