import { OptionsKeys } from '@dzone/shared-lib';

type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};
type RecordType = Record<string, UserRecord[]> | Record<string, UserRecord>;

export const getUsersOptions = (records: RecordType) => {
  const list: Record<string, any> = { [OptionsKeys.AssignedTo]: [] };
  const keys = [
    OptionsKeys.CustomerSuccessManager,
    OptionsKeys.CustomerSuccessRep,
    OptionsKeys.OperationsManager,
    OptionsKeys.QAManager,
    OptionsKeys.QATeamLeader,
    OptionsKeys.DeliveryManager,
    OptionsKeys.MISTeamLeader,
    OptionsKeys.CCDTeamLeader,
  ];
  const keysInData = Object.keys(records);
  const uniqueUserIds = new Set<string>();

  keysInData.forEach((key) => {
    let users: any[] = [];
    if (Array.isArray(records[key])) {
      users = (records[key] as UserRecord[]).map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
        role: user.role,
        status: user.status,
      }));
    } else {
      const user = records[key] as UserRecord;
      users = [
        {
          label: `${user.firstName} ${user.lastName}`,
          value: user.id,
          role: user.role,
          status: user.status,
        },
      ];
    }

    users.forEach((user) => {
      if (!uniqueUserIds.has(user.value)) {
        uniqueUserIds.add(user.value);
        list[OptionsKeys.AssignedTo].push(user);
      }
    });

    if (keys.includes(key as OptionsKeys)) {
      list[key] = users;
    }
  });
  return list;
};
