import { ICollaborator } from '../types';

export const transformCollaboratorsValues = (user?: ICollaborator) => {
  return user && {
    label: `${user?.firstName} ${user?.lastName}`,
    value: user?.id,
    role: user?.role,
    status: user?.status,
  }
};
