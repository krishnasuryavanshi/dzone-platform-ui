import { useTranslation } from 'react-i18next';
import { saveFileFromBlob, CLR_BLACK, hasActiveFilters } from '@dzone/shared-lib';
import { Flex, Typography, notification } from 'antd';
import { FC, useState } from 'react';
import { ILeadsExportMetadata } from '../lib/types';
import { filtersArray } from '../lib/utils/get-filtered-arrays';
import {
  exportFilteredLeads,
  fetchExportLeadsMetadata,
  fetchFilteredLeadsCount,
} from '../services';
import { LeadsActions } from './leads-actions';

const { Text } = Typography;

// Placeholder type for Filters until table utils are migrated
type Filters = Record<string, any>;

interface ILeadsFiltersManagerProps {
  handleClearFilters: () => void;
  filteredInfo: Filters;
  disableExportButton: boolean;
  isSearchDisabled: boolean;
  isFilterDisabled: boolean;
  isRefreshDisabled: boolean;
}

export const LeadsFiltersManager: FC<ILeadsFiltersManagerProps> = ({
  handleClearFilters,
  filteredInfo,
  isFilterDisabled,
  isRefreshDisabled,
  isSearchDisabled,
}) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMetadata, setExportMetadata] = useState<ILeadsExportMetadata[]>(
    [],
  );

  const filteredLeadArray = filtersArray(filteredInfo);

  const handleExportLeads = async (resource: string) => {
    const { data, headers } = await exportFilteredLeads(
      resource,
      filteredLeadArray,
    );
    if (data) {
      const contentDisposition =
        typeof headers?.get === 'function'
          ? headers.get('content-disposition')
          : (headers as any)?.['content-disposition'];
      const fileName = contentDisposition?.split('filename=')[1] || 'export';
      const contentType =
        typeof headers?.get === 'function'
          ? headers.get('content-type')
          : (headers as any)?.['content-type'];
      saveFileFromBlob(
        data,
        fileName.replaceAll('"', ''),
        contentType,
      );
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      let exportLeadsApisMetadata = exportMetadata;
      const exportCount = await fetchFilteredLeadsCount(filteredLeadArray);
      const count = exportCount?.rowCount;
      notification.info({
        message: exportCount?.messageHeader,
        description: exportCount?.message,
      });
      if (exportLeadsApisMetadata?.length === 0) {
        const exportLeadsMetadata = await fetchExportLeadsMetadata();
        setExportMetadata(exportLeadsMetadata);
        exportLeadsApisMetadata = exportLeadsMetadata;
      }
      const exportEndpointObject = exportLeadsApisMetadata.find((metadata) => {
        return count < metadata.upToCount;
      });
      if (exportEndpointObject) {
        handleExportLeads(exportEndpointObject.Endpoint);
      }
    } catch (error) {
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Flex justify='space-between' align='center'>
      <Text style={{ color: CLR_BLACK, fontWeight: 600, fontSize: '1.125rem' }}>
        {t('Leads')}
      </Text>
      <Flex align='center' gap={'0.75rem'}>
        <LeadsActions
          onExport={handleExport}
          onClearFilters={handleClearFilters}
          isExporting={isExporting}
          isSearchDisabled={isSearchDisabled}
          isFilterDisabled={isFilterDisabled}
          isRefreshDisabled={isRefreshDisabled}
          hasActiveFilters={hasActiveFilters(filteredInfo)}
        />
      </Flex>
    </Flex>
  );
};
