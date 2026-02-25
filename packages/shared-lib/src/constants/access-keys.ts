import { AccessKeys, Roles } from '../enums';

type AccessKeysValues = {
  [key in AccessKeys]: Roles[];
};

const { Admin, User, Agent } = Roles;

export const accessKeys: AccessKeysValues = {
  'view-users-list': [Admin, Agent],
  'view-user': [Admin, User, Agent],
  'create-user': [Admin, Agent, User],
  'edit-user': [Admin, Agent],
  'edit-users-button': [Admin, Agent],
};
