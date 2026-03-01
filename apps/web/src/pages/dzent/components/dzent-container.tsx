import { type FC, useEffect } from 'react';
import { Hideable } from '@dzone/shared-ui';
import { useAuthStore } from '@dzone/shared-store';
import { useDzentStore } from '../stores/use-dzent-store';
import { DzentWrapper } from './dzent-wrapper';
import { TenantSelection } from './tenant-selection';

export const DzentContainer: FC = () => {
  const {
    initiateChatSetup,
    chatStatus,
    tenantCode,
    setTenantCode,
  } = useDzentStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (chatStatus === 'Idle' && tenantCode) {
      initiateChatSetup();
    }
  }, [tenantCode]);

  useEffect(() => {
    if (user?.tenantCode?.length === 1) {
      setTenantCode(user.tenantCode[0]);
    }
  }, [user]);

  if (!chatStatus) {
    return null;
  }

  return (
    <>
      <Hideable show={!tenantCode && !!user?.userId}>
        <TenantSelection userId={user?.userId} />
      </Hideable>
      <Hideable show={!!tenantCode}>
        <DzentWrapper />
      </Hideable>
    </>
  );
};
