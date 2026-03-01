import { FC, useEffect, useState } from 'react';
import { Row, Typography, Divider, Skeleton, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash-es';
import { ShowFieldColumn } from './show-field-column';
import { LineItemFields } from '../../line-items/lib/enums';
import { handleFileDownload } from '../../lib/utils';

const { Text } = Typography;

enum DownloadLineItemFilesType {
  DownloadJobTitleListFile = 'DOWNLOAD_JOB_TITLE_LIST_FILE',
  DownloadTechnologyFile = 'DOWNLOAD_TECHNOLOGY_FILE',
  DownloadIntentKeywordsFile = 'DOWNLOAD_INTENT_KEYWORDS_FILE',
  DownloadSuppressionFile = 'DOWNLOAD_SUPPRESSION_FILE',
  DownloadTALFile = 'DOWNLOAD_TAL_FILE',
  DownloadDeliveryTemplateFile = 'DOWNLOAD_DELIVERY_TEMPLATE_FILE',
}

const LineItemFilesList: Record<string, DownloadLineItemFilesType> = {
  [LineItemFields.JobTitleListUpload]: DownloadLineItemFilesType.DownloadJobTitleListFile,
  [LineItemFields.TechnologyListUpload]: DownloadLineItemFilesType.DownloadTechnologyFile,
  [LineItemFields.IntentKeywordsList]: DownloadLineItemFilesType.DownloadIntentKeywordsFile,
  [LineItemFields.SuppressionListUpload]: DownloadLineItemFilesType.DownloadSuppressionFile,
  [LineItemFields.TargetAccountListTALUpload]: DownloadLineItemFilesType.DownloadTALFile,
  [LineItemFields.DeliveryTemplate]: DownloadLineItemFilesType.DownloadDeliveryTemplateFile,
};

export interface IShowFieldsProps {
  itemDetails?: Record<string, any>;
  formConfig: any;
  isCollapsed: boolean;
  completedStepId: number;
  summaryViewFields: string[];
  stepKeysList: Record<string, number>;
}

export const ShowFields: FC<IShowFieldsProps> = ({
  itemDetails,
  isCollapsed,
  summaryViewFields,
}) => {
  const { t } = useTranslation();
  // TODO: Import useShowSectionData hook when available in 5C
  // const { sectionList } = useShowSectionData(itemDetails, completedStepId, formConfig, stepKeysList);
  const sectionList: any[] = [];
  const [sectionsListData, setSectionsListData] = useState<any[]>([]);

  useEffect(() => {
    if (isCollapsed) {
      const firstStepData = sectionList?.length && cloneDeep(sectionList[0]);
      if (firstStepData) {
        firstStepData.title = '';
        firstStepData.fields = firstStepData.fields.filter(
          (field: Record<string, any>) => summaryViewFields.includes(field.field),
        );
        setSectionsListData([firstStepData]);
      } else {
        setSectionsListData([]);
      }
    } else {
      setSectionsListData(sectionList?.length ? cloneDeep(sectionList) : []);
    }
  }, [isCollapsed, sectionList]);

  const handleDownloadFiles = async (field: any) => {
    if (field.field in LineItemFilesList) {
      const fileType = LineItemFilesList[field.field];
      const resourceFetcher = async () => {
        const { downloadLineItemFiles } = await import('../../line-items/services');
        return downloadLineItemFiles(itemDetails?.id as string, { fileType, fileId: field.value.id });
      };
      await handleFileDownload(resourceFetcher, 'content-disposition');
    } else {
      const resourceFetcher = async () => {
        const { downloadIOFile } = await import('../../campaigns/services');
        return downloadIOFile(itemDetails?.id!, field.value.id);
      };
      await handleFileDownload(resourceFetcher, 'content-disposition');
    }
  };

  if (!sectionsListData?.length) return <Skeleton active />;

  return (
    <>
      {sectionsListData.map((section, index) => (
        <Flex key={section.title} vertical style={{ margin: '0.5rem 0' }}>
          <Text strong>{t(section.title)}</Text>
          <Row>
            {section?.fields?.map((field: any) => (
              <ShowFieldColumn key={field.field} data={field} handleDownload={() => handleDownloadFiles(field)} />
            ))}
          </Row>
          {index < sectionsListData.length - 1 && <Divider />}
        </Flex>
      ))}
    </>
  );
};
