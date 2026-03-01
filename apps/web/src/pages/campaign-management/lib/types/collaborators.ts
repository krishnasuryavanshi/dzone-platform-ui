export interface ICollaborator {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  emailId: string;
  role: string;
  status: string;
}

export interface ICollaborators {
  customerSuccessManager: ICollaborator;
  customerSuccessRep: ICollaborator;
  operationsManager: ICollaborator;
  operationsTeamLeader: ICollaborator;
  misTeamLeader: ICollaborator;
  qaManager: ICollaborator;
  qaTeamLeader: ICollaborator;
  deliveryManager: ICollaborator;
  ccdTeamLeader: ICollaborator;
  assignedTo: ICollaborator[];
}
