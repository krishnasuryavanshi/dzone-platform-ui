export enum ApiResources {
  AuthToken = 'auth/login',
  AuthLogout = 'auth/logout',

  Campaigns = 'campaigns',
  FilteredCampaigns = 'campaigns/filteredCampaigns',
  CampaignStatuses = 'lookups/campaigns/statuses',
  CampaignsLookupGoals = 'campaigns/lookup/goals',
  CampaignsLookupDelivery = 'campaigns/lookup/delivery',
  UpdateCampaignCollaborators = 'campaigns/updateCollaborator',
  CampaignsLookupCollaborators = 'user/getUserByRoleGroup',
  CampaignsById = 'campaigns/{campaignId}',
  CloneCampaign = 'campaigns/cloneCampaign/{campaignId}',
  ValidateCampaignById = 'campaigns/{campaignId}/editable',

  CampaignsClients = 'campaigns/clients',
  AllCampaigns = 'campaigns/all',
  FilterCampaignsByMarketer = 'campaigns/by-tenant',

  Clients = 'clients',
  ClientsLookUp = 'clients/lookup',
  ValidateClientById = 'clients/{clientId}/editable',

  ActiveCampaignsList = 'campaigns/attachable',

  LineItems = 'line-items',
  FilteredLineitems = 'line-items/filteredLineItems',
  LineItemStatusesLookup = 'lookups/lineItems/all/status',
  AllLineItems = 'line-items/all',
  LineItemsByCampaignId = 'line-items/campaigns',
  LineItemById = 'line-items/{lineItemId}',
  ValidateCreateLineItemAction = 'line-items/{campaignId}/createable',
  CloneLineItem = 'line-items/{lineItemId}/clone',
  UpdateLineItemStatus = 'line-items/{lineItemId}/status',
  UpdateLineItemCollaborators = 'line-items/{lineItemId}/assign-collaborator',
  LineItemsCustomQuestionSetNumbers = 'line-items/getCustomQuestionSetNumber',
  UpdateLineItemCustomFields = 'line-items/{lineItemId}/custom-fields',

  Lookups = 'lookups',
  ValidateLineItemById = 'line-items/{lineItemId}/editable',
  DownloadLeadUploadTemplate = 'leads/downloadDynamicTemplate',

  LineItemEmployeeCustomRange = 'line-items/employee/custom-range',

  LineItemDeliveryTemplateUploadMetaData = 'uploadFile/delivery-template/properties',
  LineItemTALUploadMetaData = 'uploadFile/tal-file/properties',
  LineItemSuppressionMetaData = 'uploadFile/suppression-file/properties',
  LineItemJobTitleFileMetaData = 'uploadFile/jobTitle-file/properties',
  LineItemInteKeywordFileMetaData = 'uploadFile/intentKeyword-file/properties',
  LineItemTEchnologyFileMetaData = 'uploadFile/technology-file/properties',

  LineItemsFileUploadMetaData = 'file/types',
  LineItemSingleFileUpload = 'file/upload',
  LineItemMultipleFileUploads = 'file/uploads',
  FileDownload = 'file/downloads/{fileId}',
  LineItemHistory = 'histories/{entity_type}/{entity_id}',
  FileDetails = 'file/metadata',
  MultipleFileDetails = 'file/metadata/batch',

  LineItemDeliveryTemplateUpload = 'uploadDeliveryTemplateFile/s3',
  LineItemTALFileUpload = 'uploadTALFile/s3',
  LineItemSupressionFileUpload = 'uploadSuppressionFile/s3',
  LineItemJobTitleListFielUpload = 'uploadJobTitleListFile/s3',
  LineItemIntentKeyworkdFileUpload = 'uploadIntentKeywordFile/s3',
  LineItemTechnologyFileUpload = 'uploadTechnologyFile/s3',
  GeneratePacingChart = 'pacing/generate',
  ValidationTemplates = 'orgs/{orgCode}/settings',

  LineItemStatusLookup = 'lookups/line-items/statuses',

  // leads upload service
  UploadFile = 'leads/upload',
  UploadIOFile = 'uploadIOFile/s3',

  DownloadIOFile = 'downloadIOFile/s3/campaign',

  DownloadDeliveryTemplateFile = 'downloadDeliveryTemplateFile/s3/lineItem',
  DownloadTechnologyFile = 'downloadTechnologyFile/s3/lineItem',
  DownloadTALFile = 'downloadTALFile/s3/lineItem',
  DownloadSuppressionFile = 'downloadSuppressionFile/s3/lineItem',
  DownloadJobTitleListFile = 'downloadJobTitleListFile/s3/lineItem',
  DownloadIntentKeywordsFile = 'downloadIntentKeywordsFile/s3/lineItem',

  TransformAndExportLeads = 'transformation/egress',
  TranformationHistory = 'transformation/histories',
  LeadsByLineItemId = 'leads/lineItems/{lineItemId}',
  Leads = 'leads',
  LeadsByBatchId = 'leads/lineItem/{lineItemId}/batch/{batchId}',
  LeadsByStatuses = 'leads/lineItems/{lineItemId}/filters',
  ExportLeads = 'exportLead/all',
  FilteredLeads = 'leads/filteredLeads',
  ExportFilteredLeads = 'exportLead/filteredLeads',
  FilteredLeadsCount = 'leads/export/count',
  ExportLeadsMetadata = 'leads/export/metadata',
  RejectReasons = 'lookups/Leads/rejectReason',

  LeadStatuses = 'lookups/leads/statuses',
  LeadsSearchMinCharacterLength = 'leads/min-characters',
  LeadValidationStatuses = 'lookups/leads/workflow-statuses',
  LeadReviewFormConfig = 'leads/fields-config',
  LeadsDetails = 'leads/list',
  LeadDetailsById = 'leads/{id}',
  LeadsValidation = 'lead-validation/validate',

  // Platform Service
  Integrations = 'integrations',
  IntegrationTypes = 'integrations/types',
  ExportFilteredLeadsByStatusAndValidationStatuses = 'line-items/{lineItemId}/validated-leads/export',
  LeadValidationHistory = 'line-item/{lineItemId}/lead/validation-history',
  TotalLeadsCount = 'leads/lineItems/{lineItemId}/count',
  TotalFilteredLeadsCount = 'leads/lineItem/{lineItemId}/filteredCount',
  LeadUploadValidationCount = 'leads/lineItems/{lineItemId}/validation-status-counts',
  LeadUpsertTaskStatus = 'tasks/{requestId}/status',

  DashboardStatsNoOfCantacts = 'dashboard/stats/no-of-contacts',
  DashboardStatsNoOfLeadsDelivered = 'dashboard/stats/no-of-leads-delivered',
  DashboardStatsDeliverableLeadsPercentage = 'dashboard/stats/deliverable-leads-percentage',
  DashboardStatsAvgTimeFirstLeadDelivery = 'dashboard/stats/avg-time-first-lead-delivery',
  DashboardStatsAvgTimeResearchToAudit = 'dashboard/stats/avg-time-research-to-audit',
  DashboardStatsAvgTimeQaToDelivery = 'dashboard/stats/avg-time-qa-to-delivery',
  DashboardStatsLeadsDelivered = 'dashboard/stats/leads-delivered',
  DashboardStatsUniqueAccountReached = 'dashboard/stats/unique-account-reached',
  DashboardExecutiveBookings = 'dashboard/stats/bookings',
  DashboardExecutiveWatingToGoLive = 'dashboard/stats/waiting-to-go-live',
  DashboardExecutiveGrid = 'dashboard/grid/campaign-status-kpis',

  DashboardChartsInternalRejectRate = 'dashboard/chart/internal-rejection-rates',
  DashboardChartsClientRejectRate = 'dashboard/chart/external-rejection-rates',
  DashboardChartsLeadStatus = 'dashboard/chart/leads-status-count',
  DashboardChartsNoOfBillableLeads = 'dashboard/chart/billed-leads-count',
  DashboardChartsDollarAmountForBillableLeads = 'dashboard/chart/billed-leads-amount',
  DashboardChartsLeadsByJobTitle = 'dashboard/chart/leads-by-job-title',
  DashboardChartsLeadsByCountry = 'dashboard/chart/leads-by-country',
  DashboardChartsPacing = 'dashboard/chart/pacing-report',
  DashboardChartsInternalRejectReasons = 'dashboard/chart/internal-rejection-reasons',

  AllUsers = 'user/allUsers',

  DeliveryTemplatesByMarketer = 'delivery-template/template/marketer/{marketerCode}',
  DeliveryTemplates = 'delivery-template',
  DeliveryTemplateCoreDataForCreate = 'delivery-template/getMasterTemplate',
  DeliveryTemplateUploadDataMapperFile = 'file-handler/uploadFile/s3/dataMapper',
  DeliveryTemplateUploadDataMapperFileMetadata = 'uploadFile/getFileMetaData',
  SaveDeliveryTemplate = 'delivery-template',
  ExportSampleDeliveryTemplate = 'file-handler/download/template-sample/s3/{templateId}',
  DeliveryTemplatesReservedDestinationNames = 'delivery-template/reserved-keywords',
  DeliveryTemplatesFieldDataTypes = 'delivery-template/getDataDictionary',
  DeliveryTemplateDetails = 'delivery-template/getTemplate/{templateId}',
  DeliveryTemplateUpdateDetails = 'delivery-template/{templateId}',
  DownloadDataMapperUploadTemplate = 'file-handler/download/data-mapper-sample',
  DownloadDataMapperFile = 'file-handler/download/data-mapper/{fileId}',

  DeliveryObjects = 'integrations/{type}/{integrationId}/forms',
  IntegrationNames = 'integrations/type/{integration_type}',
  ZapierIntegrationNames = 'integrations/type/{integration_type}/label/{label}',
  FormFields = 'integrations/{type}/{integrationId}/forms/{formId}/fields',
  DeliveryTypes = 'delivery-types',
  IntegrationById = 'integrations/{integrationId}',

  FormFieldsMapping = 'integrations/{integrationId}/mapped-fields', // Webform Only
  DestinationDropdownFields = 'integrations/{integrationId}/form-fields', // Webform and Hubspot Only

  JobTitleRecommendations = 'recommend/job-titles',
  AnalyticsLogsJobTitleRecommendations = 'log/job-title-recommendation',

  FetchRolesByPagination = 'roles',
  RoleModules = 'modules',
  RoleDetails = 'roles/{roleId}',
  PermissionsByActionId = 'attributes/module/{moduleId}/action/{actionId}',
  PermissionsByRoleId = 'roles/{roleId}/permissions',
  SaveRoles = 'roles',
  UpdateRole = 'roles/{roleId}',
  UpdateRoleStatus = 'roles/{roleId}/status/{status}',
  RolesByTypes = 'roles/types/{types}',

  Users = 'users',
  PaginatedUsers = 'users/paginated',
  UserDetails = 'users/{userId}',
  UpdateUserDetails = 'users/update-user/{username}',
  AdminResendSetPasswordLink = 'users/send-mail/{username}',
  ActivateUserStatus = 'users/activate-user/{username}',
  DeactivateUserStatus = 'users/deactivate-user/{username}',
  SetPassword = 'users/set-password',
  ValidateSetPasswordToken = 'users/validate/password-link/{token}',
  UserResendSetPasswordLink = 'users/resend-set-password-url/{token}',

  // Reset Password
  ResetPassword = 'users/reset-password/{username}',

  Permissions = 'roles/attributes',

  UsersWithModuleAccess = 'modules/{moduleName}/users',
  AssignedUsersInModule = 'modules/{moduleName}/assigned/users',

  Organizations = 'organizations',
  OrganizationsById = 'organizations/{organizationId}',
  OrganizationsType = 'organizations/type',
  OrganizationsByTypes = 'organizations/types/{types}',
  FilteredOrganizations = 'organizations/filters',

  PublishLeads = 'line-items/{lineItemId}/leads/publish',
  ReturnLeads = 'line-items/{lineItemId}/leads/reject',
  UpdateLeadsStatus = 'leads/status/update',

  FileUploadMetadata = 'file/types',
  MultiFileUpload = 'file/uploads',
  DownloadFile = 'file/downloads/{fileId}',

  LeadValidationSettings = 'settings',
  LeadValidationSettingMetadata = 'settings/metadata',
  MarketersLeadValidationSettings = 'orgs/{tenantCode}/settings',
  MarketersLeadValidationSettingById = 'orgs/{tenantCode}/settings/{settingId}',
  LineItemsLeadValidationSettingById = 'line-items/{lineItemId}/settings/{settingId}',
  LineItemsLeadValidationSettingByRuleName = 'line-items/{lineItemId}/settings/{settingId}/rules/{ruleName}',
  LineItemsLeadValidationSettingByAttribute = 'line-items/{lineItemId}/settings/{settingId}/attribute/{Id}',

  DzentInitialActions = 'dzent/initial-actions',
  DzentPostUserMessage = 'campaign/create',
  AiAgentFeedback = 'ai/agent-feedback',
  AiTitle = 'ai/title',
  AiConversations = 'ai/conversations/{conversationId}',

  // Delivery Schedules
  LineItemDeliverySchedules = 'delivery-schedules',
  LineItemDeliveryScheduleById = 'delivery-schedules/{scheduleId}',
  LineItemDeliveryScheduleLogsById = 'delivery-schedules/{scheduleId}/logs',
  LineItemDeliverySchedulesList = 'delivery-schedules/lineitem/{lineItemId}',

  // Delivery Templates
  DeliveryTemplateTypes = 'delivery-template-types',
  DeliveryTemplateByDeliveryType = 'delivery-template/deliveryType/{deliveryType}',
  DeliveryTemplatesByIntegration = 'delivery-template/integration/{integrationId}',
  GetLineItemsList = 'line-items/lookup',
  LineItemSourceFields = 'line-item-source-fields/{lineItemId}',
  // Delivery File Download
  DownloadDeliveryFile = 'leads/file-delivery/{token}',

  // Analytics
  MarketerFilterMasterUrl = 'marketer-filter-master',
  SupplierFilterMasterUrl = 'supplier-filter-master',
  MarketersDashboardDataUrl = 'marketer-dashboard-data',
  SupplierDashboardDataUrl = 'supplier-dashboard-data',

  // Segmentation Builder
  SegmentationBuilderFilter = 'segmentation/filters',
  SegmentationBuilderUpload = 'segmentation/files/upload',
  SegmentationBuilderSearch = 'segmentation/search',
  SegmentationBuilderSaveSearch = 'segmentation/saved-search',
  SegmentationBuilderSavedSearchList = 'segmentation/saved-search/list',
  SegmentationBuilderSavedSearchDelete = 'segmentation/saved-search/delete',
  SegmentationBuilderExportData = 'segmentation/export/data',
  SegmentationBuilderProfilesSearch = 'segmentation/profiles/search',

  // EAL
  SegmentationEAL = 'eal/',
  SegmentationEALList = 'eal/list',
  SegmentationEALDefault = 'eal/default',

  // Pixel
  Pixel = 'pixel/',
  PixelList = 'pixel/list',

  // Jobs
  Jobs = 'jobs',
  JobMonitoringJobs = 'jobs',
  JobMonitoringJobById = 'jobs/{jobId}',
}
