import { useEffect, useState } from 'react';
import { pick } from 'lodash-es';
import { checkPermission } from '@dzone/shared-lib';
import { usePermissionsStore } from '@dzone/shared-store';
import { useAuthStore } from '@dzone/shared-store';
import { LineItemFields } from '../../line-items/lib/enums';
import { CampaignField } from '../../campaigns/lib/enums';
import {
  assignedToNamesRenderer,
  completionProgressIndicator,
  dateRenderer,
} from '../utils/renderers';
import {
  campaignNameIdRenderer,
  campaignNameIdRendererNoBadge,
  lineItemNameIdRenderer,
  marketerNameIdRenderer,
} from '../utils/column-merger';

const ListColumns = [
  'columnTranslationKey',
  'label',
  'field',
  'dataIndex',
  'columnMetadata',
  'renderer',
];

type RendererFunction = (value: any, record: any, index: number) => React.ReactNode;

interface ColumnConfig {
  columnTranslationKey: string;
  label: string;
  field: string;
  dataIndex?: string;
  columnMetadata?: any;
  renderer?: string;
  permissions?: { view: string | string[] };
  columnOrder: number;
}

export function useListColumns(
  config: ColumnConfig[],
  _hasFilters?: boolean,
  filteredInfo?: Record<string, any>,
  options?: Record<string, any>,
) {
  const { accesses, attributes } = usePermissionsStore();
  const { user } = useAuthStore();
  const [listColumns, setListColumns] = useState<any[]>([]);

  useEffect(() => {
    if (config?.length && options?.isReady) {
      prepareColumns();
    }
  }, [config?.length, filteredInfo, options]);

  const getRenderer = (rendererKey: string | undefined): RendererFunction | undefined => {
    const renderersMap: Record<string, RendererFunction> = {
      completionProgressIndicator,
      assignedToNamesRenderer,
      dateRenderer,
      campaignNameIdRenderer,
      campaignNameIdRendererNoBadge,
      lineItemNameIdRenderer,
      marketerNameIdRenderer,
    };
    // statusRenderer, actionsRenderer, lineItemActionsRenderer, supplierAssignmentRenderer
    // will be added when campaigns/line-items modules are fully migrated
    return rendererKey && renderersMap[rendererKey] ? renderersMap[rendererKey] : undefined;
  };

  const prepareColumns = () => {
    const specialFields = [
      LineItemFields.LeadsDeliveryPercentage,
      CampaignField.TotalLineItems,
      CampaignField.LineItemsDeliveryPercentage,
      CampaignField.Actions,
      LineItemFields.Actions,
    ];

    const tenantCodes = user?.tenantCode || [];
    const hasSingleTenant = Array.isArray(tenantCodes) && tenantCodes.length === 1;
    const marketerFields = [
      CampaignField.Marketer,
      LineItemFields.Marketer,
      CampaignField.MarketerCode,
      CampaignField.TenantCode,
      LineItemFields.MarketerCode,
      LineItemFields.TenantCode,
    ];

    const listFields = config
      .filter((field) => {
        if (hasSingleTenant && marketerFields.includes(field.field as any)) return false;
        const permissionView = field.permissions?.view ?? [];
        const hasPermission = checkPermission(
          permissionView as string | string[],
          specialFields.includes(field.field as any) ? accesses : attributes,
        );
        const isVisible =
          !options?.hiddenColumns?.includes(field.field) && field.columnOrder && hasPermission;
        return isVisible || field.field === LineItemFields.SupplierName;
      })
      .sort((a, b) => a.columnOrder - b.columnOrder)
      .map((field) => {
        const col = pick(field, ListColumns);
        const renderer = getRenderer(col.renderer);
        return {
          title: col.columnTranslationKey || col.label,
          dataIndex: col.dataIndex || col.field,
          key: col.field,
          ...(renderer ? { render: renderer } : {}),
          ...(col.columnMetadata || {}),
        };
      });
    setListColumns(listFields);
  };

  return listColumns;
}
