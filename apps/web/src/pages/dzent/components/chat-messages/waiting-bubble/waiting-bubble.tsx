import { type FC } from 'react';
import { Hideable } from '@dzone/shared-ui';
import { useDzentStore } from '../../../stores/use-dzent-store';
import { SystemMessageWrapper } from '../system-message/system-message-wrapper';
import styles from './waiting-bubble.module.css';

export const WaitingBubble: FC = () => {
  const { isWaitingForResponse } = useDzentStore();
  return (
    <Hideable show={isWaitingForResponse}>
      <SystemMessageWrapper>
        <div className={styles.waitingBubble}>
          <span className={`${styles.dot} ${styles.dot1}`} />
          <span className={`${styles.dot} ${styles.dot2}`} />
          <span className={`${styles.dot} ${styles.dot3}`} />
        </div>
      </SystemMessageWrapper>
    </Hideable>
  );
};
