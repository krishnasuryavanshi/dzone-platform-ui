import { FC } from 'react';
import { ShowCampaignTabsType } from '../lib/enums';
import { ShowLineItems } from './show-line-items';
import { FilesContainer } from './files-container';
// TODO: Replace with line-items store in 5C
// Previously used LineItemContextProvider from '../../line-items/contexts'

interface IShowCampaignTabs {
  activeKey: string;
  campaignId: string;
  campaignUuId: string;
}

export const ShowCampaignTabsContent: FC<IShowCampaignTabs> = ({
  activeKey,
  campaignUuId,
  campaignId,
}) => {
  return (
    <>
      <ShowLineItems
        campaignId={campaignId}
        show={activeKey === ShowCampaignTabsType.LineItems}
        campaignUuId={campaignUuId}
      />
      <FilesContainer show={activeKey === ShowCampaignTabsType.Files} />
    </>
  );
};
