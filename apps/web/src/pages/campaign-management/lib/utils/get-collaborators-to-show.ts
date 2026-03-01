import { ICollaborator } from '../types';

export const getCollaboratorsToShow = (data: Record<string, any>) => {
  const {
    customerSuccessManager,
    customerSuccessRep,
    operationsManager,
    operationsTeamLeader,
    qaManager,
    qaTeamLeader,
    deliveryManager,
    misTeamLeader,
    ccdTeamLeader,
    assignedTo,
  } = data?.collaborators || {};

  return {
    customerSuccessManager:
      customerSuccessManager &&
      `${customerSuccessManager?.firstName} ${customerSuccessManager?.lastName}`,
    customerSuccessRep:
      customerSuccessRep &&
      `${customerSuccessRep?.firstName} ${customerSuccessRep?.lastName}`,
    operationsManager:
      operationsManager &&
      `${operationsManager?.firstName} ${operationsManager?.lastName}`,
    operationsTeamLeader:
      operationsTeamLeader &&
      `${operationsTeamLeader?.firstName} ${operationsTeamLeader?.lastName}`,
    qaManager: qaManager && `${qaManager?.firstName} ${qaManager?.lastName}`,
    qaTeamLeader:
      qaTeamLeader && `${qaTeamLeader?.firstName} ${qaTeamLeader?.lastName}`,
    deliveryManager:
      deliveryManager &&
      `${deliveryManager?.firstName} ${deliveryManager?.lastName}`,
    misTeamLeader:
      misTeamLeader && `${misTeamLeader?.firstName} ${misTeamLeader?.lastName}`,
    ccdTeamLeader:
      ccdTeamLeader && `${ccdTeamLeader?.firstName} ${ccdTeamLeader?.lastName}`,
    assignedTo: getAssignedTo(assignedTo),
  };
};

const getAssignedTo = (assignedTo: ICollaborator[]) => {
  return assignedTo?.map((collaborator) => {
    return `${collaborator?.firstName} ${collaborator?.lastName}`;
  });
};
