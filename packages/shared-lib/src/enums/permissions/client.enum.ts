export enum ViewClientPermissions {
  ClientId = 'Client.VIEW.clientId',
  ClientName = 'Client.VIEW.clientName',
  ClientCrmId = 'Client.VIEW.crmId',
  ClientFinanceId = 'Client.VIEW.financeId',
  ClientCreatedAt = 'Client.VIEW.createdAt',
  ClientStatus = 'Client.VIEW.status',
  ClientActive = 'Client.VIEW.ACTIVE',
  ClientInactive = 'Client.VIEW.INACTIVE',
}

export enum EditClientPermissions {
  ClientId = 'Client.EDIT.clientId',
  ClientName = 'Client.EDIT.clientName',
  ClientCrmId = 'Client.EDIT.crmId',
  ClientFinanceId = 'Client.EDIT.financeId',
  ClientCreatedAt = 'Client.EDIT.createdAt',
  ClientStatus = 'Client.EDIT.status',
}

export enum CreateClientPermissions {
  ClientId = 'Client.CREATE.clientId',
  ClientName = 'Client.CREATE.clientName',
  ClientCrmId = 'Client.CREATE.crmId',
  ClientFinanceId = 'Client.CREATE.financeId',
  ClientCreatedAt = 'Client.CREATE.createdAt',
  ClientStatus = 'Client.CREATE.status',
}

export enum ClientActionsEnum {
  View = 'Client.VIEW',
  Edit = 'Client.EDIT',
  Create = 'Client.CREATE',
}
