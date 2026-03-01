import { DZONE_CLR_BLACK } from '@dzone/shared-lib';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  FolderViewOutlined,
  FormOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { LineItemStatus } from '../enums';

// TODO: Replace with a proper Live icon component
const LiveIcon = () => <img src="/icons/live-blue.svg" alt="live" style={{ height: '1rem' }} />;

export const StatusMeta = {
  [LineItemStatus.LIVE]: {
    backgroundColor: '#D9E3FD',
    color: `${DZONE_CLR_BLACK}`,
    icon: <LiveIcon />,
  },
  [LineItemStatus.BOOKED]: {
    backgroundColor: '#FEFED8',
    color: '#BDB608',
    icon: <CalendarOutlined />,
  },
  [LineItemStatus.WAITING_TO_GO_LIVE]: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
    icon: <ClockCircleOutlined />,
  },
  [LineItemStatus.READY_FOR_LIVE]: {
    backgroundColor: '#FFF9C4',
    color: '#FBC02D',
    icon: <CheckCircleOutlined />,
  },
  [LineItemStatus.CANCELLED]: {
    backgroundColor: '#FFCDD2',
    color: '#C62828',
    icon: <CloseCircleOutlined />,
  },
  [LineItemStatus.DELIVERED]: {
    backgroundColor: '#E1F5FE',
    color: '#0288D1',
    icon: <FileDoneOutlined />,
  },
  [LineItemStatus.INVOICED]: {
    backgroundColor: '#E2F0CB',
    color: '#2E7D32',
    icon: <FileTextOutlined />,
  },
  [LineItemStatus.PAID]: {
    backgroundColor: '#C8E6C9',
    color: '#388E3C',
    icon: <DollarCircleOutlined />,
  },
  [LineItemStatus.PAUSED]: {
    backgroundColor: '#ffa500',
    color: '#8f5525',
    icon: <PauseOutlined />,
  },
  [LineItemStatus.DRAFT]: {
    backgroundColor: '#cfd4cf',
    color: '#000',
    icon: <FormOutlined />,
  },
  [LineItemStatus.ARCHIVED]: {
    backgroundColor: '#babab8',
    color: '#000',
    icon: <FolderViewOutlined />,
  },
};
