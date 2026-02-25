export enum BackendResources {
  Logout = 'auth/logout',
  Campaigns = 'campaign-management/campaigns',
  AllCampaigns = 'campaign-management/campaigns/all',
  FilteredCampaigns = 'campaign-management/campaigns/filters',
  CampaignStatuses = 'campaign-management/campaigns/statuses',
  CloneCampaign = 'campaign-management/campaigns/{campaignId}/clone',
  ValidateCampaignById = 'campaign-management/campaigns/{campaignId}/editable',
  ValidateCreateLineItemAction = 'campaign-management/campaigns/{campaignId}/line-items/createable',
  DownloadIOFile = 'campaign-management/campaigns/{campaignId}/download-io-file',
  UpdateCampaignCollaborators = 'campaign-management/campaigns/{campaignId}/update-collaborators',

  StepsPrefilledListsForCampaign = 'campaign-management/campaigns/steps-prefilled-lists',

  Clients = 'campaign-management/clients',
  ClientsLookup = 'campaign-management/clients/lookup',
  ValidateClientById = 'campaign-management/clients/{clientId}/editable',

  ActiveCampaignsList = 'campaign-management/line-items/active-campaign-list',

  FilterCampaignsByMarketer = 'campaign-management/campaigns/filter-by-marketer',

  LineItems = 'campaign-management/line-items',
  FilteredLineItems = 'campaign-management/line-items/filters',
  LineItemStatuses = 'campaign-management/line-items/statuses',
  LineItemById = 'campaign-management/line-items/{lineItemId}',
  CloneLineItem = 'campaign-management/line-items/{lineItemId}/clone',
  UpdateLineItemStatus = 'campaign-management/line-items/{lineItemId}/update-status',
  UpdateLineItemCollaborators = 'campaign-management/line-items/{lineItemId}/update-collaborators',
  LineItemsCustomQuestionsSetNumber = 'campaign-management/line-items/custom-questions-set-number',
  LineItemsFileUploadMetadata = 'campaign-management/line-items/file-upload/metadata',
  LineItemsFileUpload = 'campaign-management/file-upload',
  LineItemsFileUploadMultiple = 'campaign-management/file-upload/multiple',
  LineItemFileMetaData = 'campaign-management/file-meta-data',
  FileDownloadLineItem = 'campaign-management/file-download',

  LineItemsPicklistOptions = 'campaign-management/line-items/picklist-options',
  ValidateLineItemById = 'campaign-management/line-items/{lineItemId}/editable',
  LineItemHistory = 'campaign-management/line-items/{lineItemId}/history',
  LineItemEmployeeCountRange = 'campaign-management/line-items/max-custom-range',
  LineItemCustomFields = 'campaign-management/line-items/{lineItemId}/custom-fields',
  TransformAndExportLeads = 'campaign-management/line-items/{lineItemId}/transform-and-export-leads',
  TranformationHistory = 'campaign-management/line-items/{lineItemId}/transformation-history',
  TotalLeadsCount = 'campaign-management/line-items/{lineItemId}/total-leads-count',
  TotalFilteredLeadsCount = 'campaign-management/line-items/{lineItemId}/total-filtered-leads-count',
  GeneratePacingChart = 'campaign-management/line-items/pacing',
  ValidationTemplates = 'campaign-management/line-items/validation-templates',
  Leads = 'campaign-management/leads',
  ExportLeads = 'campaign-management/leads/export',
  ExportLeadsMetadata = 'campaign-management/leads/export/metadata',
  ExportLeadsCount = 'campaign-management/leads/export/count',
  DownloadLeadUploadTemplate = 'campaign-management/leads/download-template',
  LeadStatusPicklist = 'campaign-management/leads/leads-status-picklist',
  LeadValidationStatusPicklist = 'campaign-management/leads/lead-validation-statuses',
  LeadSearchMinCharacterLength = 'campaign-management/leads/min-characters',
  FilterLeadsByStatuses = 'campaign-management/leads/filter-leads-by-statuses',
  LeadsReviewList = 'campaign-management/leads/review-list',
  LeadDetailsById = 'campaign-management/leads/lead-details/id',
  UpdateLeadDetailsById = 'campaign-management/leads/lead-details/update-by-id',
  ValidateLeads = 'campaign-management/leads/leads-validation',
  ExporLeadsFilterByLeadAndValidationStatus = 'campaign-management/leads/export-filtered-leads-by-status-and-validation-statuses',
  LeadValidationHistory = 'campaign-management/leads/lead-validation-history',
  ReturnReasons = 'campaign-management/leads/return-reasons',
  LeadsStatusUpdate = 'campaign-management/leads/status-update',
  LeadUploadProcessingStatus = 'campaign-management/line-items/{lineItemId}/lead-upload-processing-status',
  LeadUpsertTaskStatus = 'campaign-management/line-items/lead-upsert-task-status',
  LeadReviewFormConfig = 'campaign-management/leads/review-form-config',
  FileUpload = 'file-upload',
  FileUploadIOFile = 'file-upload/io-file',
  FileDetails = 'file-details',
  MultipleFileDetails = 'file-details/multiple',
  LeadFilterOptions = 'campaign-management/leads/filter-options',

  ReportCharts = 'reports',
  ReportCounts = 'reports/counts',
  ExecutiveGrid = 'reports/executive-dashboard-grid',

  StatusPicklist = 'campaign-management/line-items/status-picklist',

  AllUsers = 'ums/users/all',
  ValidateUser = 'ums/users/validate',

  DeliveryTemplates = 'integrations-hub/templates',
  DeliveryTemplatesByMarketer = 'integrations-hub/templates/marketer-specific',
  DeliveryFileDownload = 'integrations-hub/file-download',
  DeliveryTemplateById = 'integrations-hub/templates/{templateId}',
  DeliveryTemplateCoreData = 'integrations-hub/templates/core-data',
  DeliveryTemplateDataTypes = 'integrations-hub/templates/data-types',
  DeliveryTemplateReservedDestinationNames = 'integrations-hub/templates/reserved-destination-names',
  ExportDeliveryTemplateSample = 'integrations-hub/templates/{templateId}/export-sample',
  DeliveryTemplateReservedKeywordsList = 'integrations-hub/templates/reserved-keywords',

  DeliveryTemplateUploadDataMapperFile = 'integrations-hub/templates/data-mapper-file/upload',
  DownloadDataMapperFileTemplate = 'integrations-hub/templates/data-mapper-file/download/sample-template',
  UploadDataMapperFileMetadata = 'integrations-hub/templates/data-mapper-file/metadata',
  DownloadDataMapperFile = 'integrations-hub/templates/data-mapper-file/download',
  GetLineItemsList = 'integrations-hub/templates/get-line-items-list',
  GetLineItemSourceFields = 'integrations-hub/templates/line-item-source-fields',

  DeliveryTypes = 'integrations-hub/templates/delivery-types',
  IntegrationNames = 'integrations-hub/templates/integration-names',
  IntegrationById = 'integrations-hub/templates/integration-by-id',
  DeliveryObjects = 'integrations-hub/templates/delivery-objects',
  LineItemRecommendations = 'campaign-management/line-items/recommendations',
  HubspotFormFields = 'integrations-hub/templates/hubspot-form-fields',
  WebFormFormFields = 'integrations-hub/templates/webform-form-fields',
  DestinationDropdownFields = 'integrations-hub/templates/destination-dropdown-fields',

  PushAnalyticsLogs = 'analytics/logs',

  Roles = 'ums/roles',
  RolesByTypes = 'ums/roles/types',
  PermissionsByRoleId = 'ums/roles/{roleId}',
  UpdateRoleStatus = 'ums/roles/update-status',
  AllModules = 'ums/roles/modules',
  PermissionsByActionId = 'ums/roles/permissions-by-action-id',

  Users = 'ums/users',
  UserById = 'ums/users/{userId}',
  ActivateUser = 'ums/users/{userId}/activate',
  DeactivateUser = 'ums/users/{userId}/deactivate',
  AdminResendSetPasswordLink = 'ums/users/{userId}/resend-set-password-link',
  SetPassword = 'ums/users/token/{token}/set-password',
  ValidateSetPasswordToken = 'ums/users/token/{token}/validate-set-password-token',
  UserResendSetPasswordLink = 'ums/users/token/{token}/resend-set-password-link',
  Permissions = 'permissions/permissions',
  UsersWithModuleAccess = 'ums/users/users-with-module-access',
  AssignedUsersInModule = 'ums/users/assigned-users-in-module',
  ResetPassword = 'ums/users/reset-password',

  Organizations = 'organizations',
  OrganizationsById = 'organizations/{organizationId}',
  OrganizationsType = 'organizations/type',
  OrganizationsByType = 'organizations/types',
  FilteredOrganizations = 'organizations/filter',

  PublishLeads = 'campaign-management/leads/publish',
  ReturnLeads = 'campaign-management/leads/return',

  FileUploadMetadata = 'file-upload/metadata',
  FileUploads = 'file-upload/uploads',
  FileDownload = 'file-download',

  LeadValidationSettings = 'lead-validation-settings',
  LeadValidationSettingMetadata = 'lead-validation-settings/metadata',
  MarketersLeadValidationSettings = 'lead-validation-settings/organizations/{tenantCode}/settings',
  LineItemsLeadValidationSettings = 'lead-validation-settings/line-items/{lineItemId}/settings',
  LineItemsLeadValidationSettingByAttribute = 'lead-validation-settings/line-items/{lineItemId}/settings/attribute',

  DzentInitialActions = 'dzent/initial-actions',
  DzentPostUserMessage = 'dzent/post-user-message',
  DzentConversationFiles = 'dzent/conversation-files',
  DzentAgentMessageFeedback = 'dzent/submit-agent-feedback',
  DzentConversations = 'dzent/conversations',
  DzentConversationById = 'dzent/conversations/{conversationId}',

  // Platform Service
  Integrations = 'integrations-hub/integrations',
  IntegrationTypes = 'integrations-hub/integrations/types',

  // Delivery Schedules
  LineItemDeliverySchedules = 'campaign-management/line-items/delivery-schedules',
  LineItemDeliveryScheduleById = 'campaign-management/line-items/delivery-schedules/{scheduleId}',
  LineItemDeliveryLogs = 'campaign-management/line-items/delivery-schedules/{scheduleId}/logs',

  // Delivery Templates
  DeliveryTemplateTypes = 'campaign-management/line-items/delivery-template-types',
  DeliveryTemplateList = 'campaign-management/line-items/delivery-template-list/{deliveryType}',
  SupplierGrid = 'SupplierGrid',

  //marketers
  MarketerFilterMaster = 'analytics/marketer/marketer-filter-master',
  MarketersDashBoard = 'analytics/marketer/marketer-dashboard-data?start_date={startDate}&end_date={endDate}&campaign_ids={campaignList}&supplier_names={supplierList}&line_item_ids={lineItemList}&tenantCodes={tenantCodes}',

  //supplier
  SupplierFilterMaster = 'analytics/supplier/supplier-filter-master',
  SupplierDashBoard = 'analytics/supplier/supplier-dashboard-data?start_date={startDate}&end_date={endDate}&line_item_ids={listItemList}&marketer_names={marketerList}&campaign_ids={campaignList}',

  // Segmentation Builder
  FilterSegmentationBuilder = 'audience-database/segmentation-builder',
  SegmentationBuilderUpload = 'audience-database/segmentation-builder/bulk-upload',
  SegmentationBuilderSearch = 'audience-database/segmentation-builder/search',
  SegmentationBuilderSaveSearch = 'audience-database/segmentation-builder/save-search',
  SegmentationBuilderSavedSearchList = 'audience-database/segmentation-builder/saved-search-list',
  SegmentationBuilderSavedSearchDelete = 'audience-database/segmentation-builder/saved-search-delete',
  SegmentationBuilderExportData = 'audience-database/segmentation-builder/export-data',
  SegmentationBuilderProfilesSearch = 'audience-database/segmentation-builder/profiles-search',

  // EAL
  SegmentationEAL = 'audience-database/segmentation-builder/eal',
  SegmentationEALList = 'audience-database/segmentation-builder/eal-list',
  SegmentationEALDefault = 'audience-database/segmentation-builder/eal-default',

  // Pixels
  Pixel = 'connect-platforms/pixels',
  PixelList = 'connect-platforms/pixels/pixel-list',

  // Job Monitoring
  JobMonitoringJobs = 'jobs',
  JobMonitoringJobById = 'jobs/{jobId}',
}
