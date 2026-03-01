import { ILineItem } from './line-item';
import { IStatusPicklist } from './status-meta';

export interface ILineItemContext {
  value: Record<string, string>;
  setValue: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  lineItem: ILineItem;
  setLineItem: React.Dispatch<React.SetStateAction<ILineItem>>;
  isLoading: boolean;
  showLoader: (loader: boolean) => void;
  updateList?: ILineItem;
  setUpdateList: React.Dispatch<React.SetStateAction<ILineItem | undefined>>;
  statusList: IStatusPicklist[];
}
