import { Form, notification } from 'antd';
import type { UploadFile } from 'antd';
import { useEffect, useRef, useState } from 'react';
import {
  createCampaign,
  prefilledLists,
  putCreateCampaign,
} from '../../services';
import { calculateDateDiffs, formatDate, sanitizeData } from '@dzone/shared-lib';
import {
  formatCampaignFormData,
  getChangedFields,
  processFieldPermissions,
} from '../../../lib/utils';
import CampaignDetailsSchema from '../schemas/campaign-form.json';
import { debounce } from 'lodash-es';
import { useNavigate } from 'react-router';
// TODO: Import fetchFileDetails from '../../../line-items/services' when available
// import { fetchFileDetails } from '../../../line-items/services';

const fetchFileDetails = async (_fileId: string): Promise<any> => {
  // Stub: will be replaced once line-items services are migrated
  return null;
};

export const useCampaignForm = ({
  campaignData,
  campaignUUId,
  tenantCode,
  userId,
  isDzoneUser,
}: any) => {
  const previousMarketerCode = useRef<string | undefined>(undefined);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lists, setLists] = useState<Record<string, any[]>>({});
  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>(
    {},
  );
  const [hasChanges, setHasChanges] = useState(false);

  const allFields = Form.useWatch([], form);
  const marketerCode = allFields?.marketerCode;

  const handleSubmit = debounce(async (values: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        targetStartDate: values?.targetStartDate
          ? formatDate(values?.targetStartDate)
          : undefined,
        targetEndDate: values?.targetEndDate
          ? formatDate(values?.targetEndDate)
          : undefined,
        opportunityCloseDate: values?.opportunityCloseDate
          ? formatDate(values?.opportunityCloseDate)
          : undefined,
        ioFileId: values?.ioFileId?.id,
        bookedRevenue:
          values?.bookedRevenue === 0 ? undefined : values?.bookedRevenue,
      };
      if (campaignUUId) {
        const initialFormatted = formatCampaignFormData(campaignData);
        const changedFields = getChangedFields(
          initialFormatted,
          sanitizeData(payload),
        );
        if (Object.keys(changedFields).length > 0) {
          const data = await putCreateCampaign(
            sanitizeData(changedFields),
            campaignUUId,
          );
          if (data?.data) {
            notification.success({ message: data.message });
            navigate('/campaign-management/campaigns');
          } else {
            notification.error({ message: data.message });
          }
        }
      } else {
        const data = await createCampaign(sanitizeData(payload));
        if (data?.data) {
          notification.success({ message: data.message });
          navigate('/campaign-management/campaigns');
        } else {
          notification.error({ message: data.message });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, 500);

  const fetchLists = async () => {
    const fetchedLists = await prefilledLists(userId);
    setDisabledFields({
      campaignDuration: true,
    });
    if (tenantCode && !isDzoneUser) {
      const marketer = fetchedLists.marketers?.find(
        (m: any) => m.tenantCode === tenantCode[0],
      );
      if (marketer) {
        form.setFieldsValue({
          marketerCode: marketer.tenantCode,
          marketer: marketer.label,
          tenantCode: marketer.tenantCode,
        });
        previousMarketerCode.current = marketer.tenantCode;
      }
      setDisabledFields({
        marketerCode: true,
        marketer: true,
        tenantCode: true,
        ioFileId: false,
      });
    }

    setLists(fetchedLists);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (!marketerCode || !lists?.marketers?.length) return;
    if (previousMarketerCode.current !== marketerCode) {
      const selectedMarketer = lists.marketers.find(
        (m: any) => m.tenantCode === marketerCode,
      );
      if (selectedMarketer) {
        form.setFieldsValue({
          marketer: selectedMarketer.label,
          marketerCode: selectedMarketer.tenantCode,
          tenantCode: selectedMarketer.tenantCode,
        });
        previousMarketerCode.current = marketerCode;
      }
    }
  }, [marketerCode, lists?.marketers]);

  useEffect(() => {
    const duration = calculateDateDiffs(
      allFields?.targetStartDate,
      allFields?.targetEndDate,
    );
    form.setFieldsValue({
      campaignDuration: duration,
    });
  }, [allFields?.targetStartDate, allFields?.targetEndDate]);

  useEffect(() => {
    if (!campaignData || !lists) return;
    const formatted = formatCampaignFormData(campaignData);
    form.setFieldsValue({
      ...formatted,
      marketerCode: formatted?.tenantCode,
    });
    setDisabledFields({
      marketerCode: true,
      marketer: true,
      campaignId: true,
      campaignDuration: true,
    });
  }, [lists, campaignData]);

  useEffect(() => {
    const hasChanged = getChangedFields(
      formatCampaignFormData(campaignData),
      allFields,
    );
    setHasChanges(Object.keys(hasChanged).length > 0);
  }, [allFields, campaignData]);

  const processFieldRules = (field: any) => {
    const rules: any[] = [];

    if (field.rules?.length) {
      field.rules.forEach((rule: any) => {
        if (rule.pattern) {
          rules.push({
            pattern: new RegExp(rule.pattern),
            message: rule.message || 'Invalid format',
          });
        } else {
          rules.push(rule);
        }
      });
    }

    if (field.fieldType === 'number' && typeof field.min === 'number') {
      rules.push({
        type: 'number',
        min: field.min,
        message: `Must be at least ${field.min}`,
      });
    }

    return rules;
  };

  const fetchInitialFileLists = async () => {
    if (!campaignData) return;

    const ioFileId = campaignData.ioFileId;

    if (typeof ioFileId === 'string') {
      const detail = await fetchFileDetails(ioFileId);
      if (detail?.id) {
        const enrichedDeliveryTemplate: UploadFile = {
          uid: detail.id,
          name: detail.filename,
          status: 'done',
          ...detail,
        };

        form.setFieldValue('ioFileId', enrichedDeliveryTemplate);
      }
    }
  };

  useEffect(() => {
    fetchInitialFileLists();
  }, [campaignData, form]);

  const processedFields = processFieldPermissions(
    CampaignDetailsSchema || [],
    disabledFields,
  );

  const groupedFields = processedFields.reduce(
    (acc: Record<string, any[]>, field: any) => {
      const group = field.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return {
    form,
    handleSubmit,
    isSubmitting,
    hasChanges,
    groupedFields,
    lists,
    marketerCode,
    processFieldRules,
  };
};
