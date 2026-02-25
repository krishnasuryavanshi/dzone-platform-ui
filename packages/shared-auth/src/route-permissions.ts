/**
 * Route-to-permission mapping.
 * Migrated from src/lib/utils/auth/should-validate-path.ts
 */

interface PagePermission {
  url?: string;
  urlRegexp?: RegExp;
  action: string;
}

// Regex patterns for dynamic routes
const campaignsRegex = /^\/campaign-management\/campaigns$/;
const campaignDetailRegex = /^\/campaign-management\/campaigns\/[^/]+$/;
const createCampaignRegex = /^\/campaign-management\/campaigns\/create$/;
const campaignEditRegex = /^\/campaign-management\/campaigns\/[^/]+\/edit$/;

const lineItemsRegex = /^\/campaign-management\/line-items$/;
const lineItemDetailRegex = /^\/campaign-management\/line-items\/[^/]+$/;
const createLineItemRegex = /^\/campaign-management\/line-items(\/[^/]+)?\/create$/;
const updateLineItemRegex = /^\/campaign-management\/line-items\/[^/]+\/edit$/;

const batchLeadsRegex = /^\/campaign-management\/line-items\/[^/]+\/batches\/[^/]+\/leads$/;
const lineItemLeadsRegex = /^\/campaign-management\/line-items\/[^/]+\/leads$/;
const lineItemDeliveryLogsRegex = /^\/campaign-management\/line-items\/[^/]+\/delivery-logs$/;

const lineItemsLeadValidationSettingsUpdate = /^\/lead-validation-settings\/line-items\/[^/]+\/settings\/[^/]+$/;
const tenantsLeadValidationSettingsUpdate = /^\/lead-validation-settings\/organizations\/[^/]+\/settings\/[^/]+$/;

const deliveryTemplateUpdate = /^\/integrations-hub\/templates\/[^/]+\/update$/;
const integrationDetailRegex = /^\/integrations-hub\/integrations\/[^/]+$/;

const rolesRegexp = /^\/ums\/roles\/[^/]+$/;
const usersRegexp = /^\/ums\/users\/[^/]+$/;
const organizationsRegexp = /^\/organizations\/[^/]+$/;

const analyticsMarketersRegex = /^\/analytics\/marketers$/;
const analyticsSupplierRegex = /^\/analytics\/supplier$/;

export const routePermissions: Record<string, PagePermission[]> = {
  '/organizations-dashboard': [
    { url: '/organizations-dashboard', action: 'Organizations.VIEW' },
  ],
  '/dashboard': [{ url: '/dashboard', action: 'Dashboard.VIEW' }],
  '/dzent': [{ url: '/dzent', action: 'Dzent.VIEW' }],
  '/campaign-management': [
    { url: '/campaign-management/campaigns', action: 'Campaign.VIEW' },
    { url: '/campaign-management/campaigns/create', action: 'Campaign.CREATE' },
    { urlRegexp: campaignsRegex, action: 'Campaign.VIEW' },
    { urlRegexp: campaignDetailRegex, action: 'Campaign.VIEW' },
    { urlRegexp: createCampaignRegex, action: 'Campaign.CREATE' },
    { urlRegexp: campaignEditRegex, action: 'Campaign.EDIT' },
    { url: '/campaign-management/line-items', action: 'Line Item.VIEW' },
    { urlRegexp: createLineItemRegex, action: 'Line Item.CREATE' },
    { urlRegexp: lineItemsRegex, action: 'Line Item.VIEW' },
    { urlRegexp: lineItemDetailRegex, action: 'Line Item.VIEW' },
    { urlRegexp: updateLineItemRegex, action: 'Line Item.EDIT' },
    { url: '/campaign-management/leads', action: 'Leads.VIEW' },
    { urlRegexp: lineItemLeadsRegex, action: 'Leads.VIEW' },
    { urlRegexp: batchLeadsRegex, action: 'Leads.VIEW' },
    { urlRegexp: lineItemDeliveryLogsRegex, action: 'Line Item.VIEW' },
  ],
  '/lead-validation-settings': [
    { url: '/lead-validation-settings', action: 'Validation Settings.VIEW' },
    { url: '/lead-validation-settings/create', action: 'Validation Settings.CREATE' },
    { urlRegexp: tenantsLeadValidationSettingsUpdate, action: 'Validation Settings.EDIT' },
    { urlRegexp: lineItemsLeadValidationSettingsUpdate, action: 'Validation Settings.EDIT' },
  ],
  '/integrations-hub': [
    { url: '/integrations-hub/templates', action: 'Delivery Templates.VIEW' },
    { url: '/integrations-hub/templates/create', action: 'Delivery Templates.CREATE' },
    { urlRegexp: deliveryTemplateUpdate, action: 'Delivery Templates.EDIT' },
    { url: '/integrations-hub/integrations', action: 'Integrations.VIEW' },
    { urlRegexp: integrationDetailRegex, action: 'Integrations.VIEW' },
  ],
  '/ums': [
    { url: '/ums/roles', action: 'Roles and Permissions.VIEW' },
    { urlRegexp: rolesRegexp, action: 'Roles and Permissions.VIEW' },
    { url: '/ums/roles/create', action: 'Roles and Permissions.CREATE' },
    { url: '/ums/users', action: 'Users.VIEW' },
    { url: '/ums/users/create', action: 'Users.CREATE' },
    { urlRegexp: usersRegexp, action: 'Users.VIEW' },
  ],
  '/organizations': [
    { url: '/organizations', action: 'Organizations.VIEW' },
    { url: '/organizations/create', action: 'Organizations.VIEW' },
    { urlRegexp: organizationsRegexp, action: 'Organizations.VIEW' },
  ],
  '/jobs': [{ url: '/jobs', action: 'Jobs.VIEW' }],
  '/analytics': [
    { url: '/analytics', action: 'Analytics.VIEW' },
    { urlRegexp: analyticsMarketersRegex, action: 'Analytics.Marketer Dashboard' },
    { urlRegexp: analyticsSupplierRegex, action: 'Analytics.Supplier Dashboard' },
  ],
};

/**
 * Check if a given path requires permission validation and return the matching parent key.
 */
export function shouldValidatePath(path: string): {
  shouldValidate: boolean;
  parent: string;
} {
  let parent = '';
  const shouldValidate = Object.keys(routePermissions).some((key) => {
    if (path.startsWith(key)) {
      parent = key;
      return true;
    }
    return false;
  });
  return { shouldValidate, parent };
}

/**
 * Check if the user has permission for a specific path.
 */
export function isAuthorizedForPath(
  path: string,
  accesses: Record<string, boolean>,
): boolean {
  const { shouldValidate, parent } = shouldValidatePath(path);
  if (!shouldValidate) return true;

  const pages = routePermissions[parent];
  if (!pages?.length) return true;

  for (const page of pages) {
    const matches = page.url === path || page.urlRegexp?.test(path);
    if (matches) {
      return !!accesses[page.action];
    }
  }

  // If no specific rule matches, check if any page in the group is allowed
  return pages.some((page) => accesses[page.action]);
}
