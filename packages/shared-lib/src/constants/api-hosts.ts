/**
 * API service path prefixes.
 * The base URL (VITE_API_URL) is set on the shared apiClient.
 * These paths are appended to the base URL to reach each microservice.
 */
export const ApiHost = {
  CampaignService: '/api/campaign-service',
  ReportingService: '/api/reporting-service',
  FileService: '/api/file-service',
  AuthService: '/api/rbac-service',
  LeadOrchestrationService: '/api/lead-orchestration-service',
  CampaignDeliveryService: '/api/campaign-delivery-service',
  TransformationService: '/api/transformation-service',
  RecommendationService: '/api/recommendation-service',
  AuditService: '/api/audit-service',
  RBACService: '/api/rbac-service',
  OrganizationService: '/api/organization-service',
  AICopilotService: '/api/ai-copilot',
  PlatformService: '/api/platform-service',
  CommonService: '/api/common-service',
  AnalyticsService: '/api/analytics-service',
  AudienceService: '/api/audience-service',
  JobMonitoringService: '/api/job-monitoring',
};
