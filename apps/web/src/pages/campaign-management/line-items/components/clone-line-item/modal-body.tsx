import { FC } from 'react';
import { IActiveCampaignList } from '../../lib/types';
import { SelectActiveCampaignList } from '../select-active-campaign-list';

interface IModalBodyProps {
  activeCampaignList?: IActiveCampaignList[];
  selectedActiveCampaign: string;
  selectCampaign: (campaign: any) => void;
}

export const ModalBody: FC<IModalBodyProps> = ({
  activeCampaignList,
  selectedActiveCampaign,
  selectCampaign,
}) => {
  return (
    <SelectActiveCampaignList
      activeCampaignList={activeCampaignList}
      selectedActiveCampaign={selectedActiveCampaign}
      selectCampaign={selectCampaign}
    />
  );
};
