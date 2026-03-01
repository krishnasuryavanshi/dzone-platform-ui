import React, { FC, useEffect, useRef, useState } from 'react';
import { Form, Row, Col, Flex, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import BasicDetailsSchema from '../../lib/schemas/basic-details.json';
import { renderField } from './render-field';
import {
  fetchFileDetails,
  fetchMultipleFileDetails,
  fetchPrefilledListsBasicDetails,
  fetchValidationTemplates,
  generatePacingChart,
} from '../../services';
import { ICampaign } from '../../../campaigns/lib/types';
import { fetchCampaignsByMarketer } from '../../services';
import { debounce } from 'lodash-es';
import { useNavigate } from 'react-router';
import { dateObject, formatDate, sanitizeData } from '@dzone/shared-lib';
import { notification } from 'antd';
import { createLineItem } from '../../services';
import { updateLineItem } from '../../services';
import {
  formatLineItemFormData,
  processFieldPermissions,
} from '../../../lib/utils';
import {
  ILineItem,
  IPacingChartType,
  IPacingRequestData,
} from '../../lib/types';
import dayjs from 'dayjs';
import { LoaderButton } from '@dzone/shared-ui';
import {
  DATE_FIELDS,
  EXCLUDED_DATE_FIELDS,
  PACING_KEYS,
} from '../../lib/constants';
import { LineItemFields } from '../../lib/enums';

const { Text } = Typography;

interface IBasicDetailsProps {
  campaignUuid?: string;
  campaignData?: any;
  lineItemId?: string;
  lineItemDetails?: ILineItem;
  userId?: string;
  tenantCode?: string | string[];
  isDzoneUser?: boolean;
  onCreateSuccess: (newLineItemId: string) => void;
  nextStep?: number;
  handleStepperChange?: (key: number) => void;
}

export const BasicDetails: FC<IBasicDetailsProps> = ({
  campaignUuid,
  campaignData,
  lineItemId,
  lineItemDetails,
  userId,
  onCreateSuccess,
  nextStep,
  handleStepperChange,
}) => {
  const previousMarketerCode = useRef<string | undefined>(undefined);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lists, setLists] = useState<Record<string, any[]>>({});
  const [disabledFields, setDisabledFields] = useState<Record<string, boolean>>(
    {},
  );
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [pacingSchedule, setPacingSchedule] = useState<IPacingChartType[]>([]);

  const allFields = Form.useWatch([], form);
  const marketerCode = allFields?.marketerCode;

  useEffect(() => {
    // If only one marketer, auto-select and disable
    if (lists.marketers && lists.marketers.length === 1) {
      const marketer = lists.marketers[0];
      form.setFieldsValue({
        marketer: marketer.label,
        marketerCode: marketer.tenantCode,
        tenantCode: marketer.tenantCode,
      });
      setDisabledFields((prev) => ({
        ...prev,
        marketer: true,
        marketerCode: true,
        tenantCode: true,
      }));
      previousMarketerCode.current = marketer.tenantCode;
      fetchAndFilterCampaigns(marketer.tenantCode);
      fetchValidationSettings(marketer.tenantCode);
      return;
    }

    // If marketerCode changes, update related fields and fetch campaigns/settings
    if (
      marketerCode &&
      previousMarketerCode.current !== marketerCode &&
      lists.marketers?.length
    ) {
      previousMarketerCode.current = marketerCode;

      form.setFieldsValue({
        campaignId: undefined,
        campaignName: undefined,
        campaignIdNumber: undefined,
      });

      const selectedMarketer = lists.marketers.find(
        (marketer) => marketer.tenantCode === marketerCode,
      );

      if (selectedMarketer) {
        form.setFieldsValue({
          marketer: selectedMarketer.label,
          tenantCode: selectedMarketer.tenantCode,
        });
      }

      fetchAndFilterCampaigns(marketerCode);
      fetchValidationSettings(marketerCode);
    }
  }, [lists.marketers, marketerCode, form]);

  useEffect(() => {
    if (lineItemDetails?.campaign?.id && lists.campaigns?.length) {
      const matched = lists.campaigns.find(
        (campaign) => campaign.value === lineItemDetails?.campaign?.id,
      );
      if (matched) {
        form.setFieldsValue({
          campaignId: matched.value,
          campaignName: matched.label,
          campaignIdNumber: matched.campaignId,
        });
      }
    }
  }, [lists.campaigns, lineItemDetails?.campaign?.id]);

  useEffect(() => {
    const selectedCampaign = lists.campaigns?.find(
      (campaign) => campaign.value === allFields?.campaignId,
    );

    if (selectedCampaign) {
      form.setFieldsValue({
        campaignName: selectedCampaign.label,
        campaignIdNumber: selectedCampaign.campaignId,
      });
    }
  }, [allFields?.campaignId, lists.campaigns]);

  useEffect(() => {
    if (lineItemDetails && lineItemId) {
      const formattedLineItemDetails = formatLineItemFormData(lineItemDetails);
      const formattedDates = {
        lineItemTargetStartDate:
          formattedLineItemDetails?.lineItemTargetStartDate
            ? dayjs(formattedLineItemDetails?.lineItemTargetStartDate)
            : null,
        lineItemTargetEndDate: formattedLineItemDetails?.lineItemTargetEndDate
          ? dayjs(formattedLineItemDetails?.lineItemTargetEndDate)
          : null,
        createdAt: formattedLineItemDetails?.createdAt
          ? dayjs(formattedLineItemDetails?.createdAt)
          : null,
        updatedAt: formattedLineItemDetails?.updatedAt
          ? dayjs(formattedLineItemDetails?.updatedAt)
          : null,
        actualEndDate: formattedLineItemDetails?.actualEndDate
          ? dateObject(formattedLineItemDetails?.actualEndDate)
          : null,
        actualStartDate: formattedLineItemDetails?.actualStartDate
          ? dateObject(formattedLineItemDetails?.actualStartDate)
          : null,
        targetDeliveryStartDate:
          formattedLineItemDetails?.targetDeliveryStartDate
            ? dateObject(formattedLineItemDetails?.targetDeliveryStartDate)
            : null,
      };
      const prefilledFields = {
        ...formattedLineItemDetails,
        campaignId: formattedLineItemDetails?.campaign?.id,
        campaignName: formattedLineItemDetails?.campaign?.name,
        campaignIdNumber: formattedLineItemDetails?.campaign?.campaignId,
        marketer: formattedLineItemDetails?.marketer ?? undefined,
        marketerCode: formattedLineItemDetails?.marketerCode ?? undefined,
        tenantCode: formattedLineItemDetails?.tenantCode ?? undefined,
        ...formattedDates,
      };
      form.setFieldsValue(prefilledFields);

      const updatedDisabledFields = {
        marketerCode: true,
        marketer: true,
        tenantCode: true,
        campaignId: true,
        campaignName: true,
        campaignIdNumber: true,
      };
      setDisabledFields(updatedDisabledFields);
    }
  }, [lineItemDetails, form]);

  const hasPacingChanged = (
    initial: Record<string, any>,
    current: Record<string, any>,
  ) => {
    const format = (val: any) =>
      val && dayjs(val).isValid() ? dayjs(val).format('YYYY-MM-DD') : '';

    return PACING_KEYS.some((key) => {
      const a = key.includes('Date') ? format(initial[key]) : initial[key];
      const b = key.includes('Date') ? format(current[key]) : current[key];
      return a !== b;
    });
  };

  const getChangedFields = (
    initialValues: Record<string, any>,
    currentValues: Record<string, any>,
  ) => {
    const cleanedInitial = Object.fromEntries(
      Object.entries(initialValues || {}).filter(
        ([key]) => !EXCLUDED_DATE_FIELDS.includes(key as LineItemFields),
      ),
    );

    const cleanedCurrent = Object.fromEntries(
      Object.entries(currentValues || {}).filter(
        ([key]) => !EXCLUDED_DATE_FIELDS.includes(key as LineItemFields),
      ),
    );

    const changedFields: Record<string, any> = {};

    const dateFormat = (val: any) =>
      val && dayjs(val).isValid() ? dayjs(val).format('YYYY-MM-DD') : '';

    const dateChanged = (field: string) =>
      dateFormat(cleanedInitial[field]) !== dateFormat(cleanedCurrent[field]);

    const isDifferent = (key: string) =>
      JSON.stringify(cleanedInitial[key]) !==
      JSON.stringify(cleanedCurrent[key]);

    for (const key of Object.keys(cleanedCurrent)) {
      if (DATE_FIELDS.includes(key as LineItemFields)) {
        if (dateChanged(key)) {
          changedFields[key] = cleanedCurrent[key];
        }
      } else if (key === 'assetFileIds') {
        const initialIds: string[] = Array.isArray(cleanedInitial[key])
          ? cleanedInitial[key]
          : [];

        const currentIds: string[] = Array.isArray(cleanedCurrent[key])
          ? cleanedCurrent[key]
              .map((file: any) =>
                typeof file === 'object' && file !== null ? file.id : file,
              )
              .filter((id: any) => typeof id === 'string')
          : [];

        const sortedInitial = [...initialIds].sort();
        const sortedCurrent = [...currentIds].sort();

        const arraysAreEqual =
          sortedInitial.length === sortedCurrent.length &&
          sortedInitial.every((id, index) => id === sortedCurrent[index]);

        if (!arraysAreEqual) {
          changedFields['assetFileIds'] = currentIds;
        }
      } else if (key === 'deliveryTemplateId') {
        const getId = (val: any) =>
          typeof val === 'object' && val !== null ? val.id : val;

        const initialId = getId(cleanedInitial[key]);
        const currentId = getId(cleanedCurrent[key]);

        if (initialId !== currentId) {
          if (currentId === null || currentId === undefined) {
            changedFields['deliveryTemplateFileDeleted'] = true;
          } else {
            changedFields['deliveryTemplateId'] = currentId;
          }
        }
      } else if (isDifferent(key)) {
        changedFields[key] = cleanedCurrent[key];
      }
    }

    const pacingChanged = PACING_KEYS.some(
      (key) => dateChanged(key as string) || isDifferent(key as string),
    );

    if (!pacingChanged) {
      delete changedFields['pacingSchedule'];
    }
    return changedFields;
  };

  const showNotification = (config: { message: string; type?: string }) => {
    if (config.type === 'error') {
      notification.error({ message: config.message });
    } else {
      notification.success({ message: config.message });
    }
  };

  const handleUpdateLineItem = async (
    values: Record<string, any>,
    id: string,
  ) => {
    const initialFormatted = formatLineItemFormData(lineItemDetails!);
    const changedFields = getChangedFields(initialFormatted, values);
    const pacingShouldBeSent = hasPacingChanged(initialFormatted, values);
    if (pacingShouldBeSent) {
      changedFields.pacingSchedule = pacingSchedule;
    }
    if (Object.keys(changedFields).length > 0) {
      const data = await updateLineItem(sanitizeData(changedFields), id);
      if (data?.data) {
        showNotification({ message: data?.message });
        onCreateSuccess?.(data.data.id);
        handleStepperChange && nextStep && handleStepperChange(nextStep);
      } else {
        showNotification({ message: data?.message, type: 'error' });
      }
    }
  };

  const handleCreateLineItem = async (values: Record<string, any>) => {
    const data = await createLineItem(sanitizeData(values));
    if (data?.data) {
      showNotification({ message: data.message });
      onCreateSuccess?.(data.data.id);
    } else {
      showNotification({ message: data.message, type: 'error' });
    }
  };

  const handleFinish = async (values: Record<string, any>) => {
    if (!hasChanges) {
      handleStepperChange && nextStep && handleStepperChange(nextStep);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: Record<string, any> = {
        ...values,
        pacingSchedule,
        lineItemTargetStartDate: values?.lineItemTargetStartDate
          ? formatDate(values?.lineItemTargetStartDate)
          : undefined,
        lineItemTargetEndDate: values?.lineItemTargetEndDate
          ? formatDate(values?.lineItemTargetEndDate)
          : undefined,
        targetDeliveryStartDate: values?.targetDeliveryStartDate
          ? formatDate(values?.targetDeliveryStartDate)
          : undefined,
        assetFileIds: values?.assetFileIds?.map((file: any) => file.id),
        deliveryTemplateId: values?.deliveryTemplateId?.id,
      };

      if (lineItemId) {
        await handleUpdateLineItem(payload, lineItemId);
      } else {
        await handleCreateLineItem(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = debounce(handleFinish, 500);

  const fetchLists = async () => {
    try {
      const fetchedLists = await fetchPrefilledListsBasicDetails(userId);
      setLists(fetchedLists as any);
    } catch (error) {}
  };

  const fetchAndFilterCampaigns = async (marketerCode: string) => {
    try {
      const allCampaigns = await fetchCampaignsByMarketer(marketerCode);
      const mapped = allCampaigns?.map((campaign: ICampaign) => ({
        label: campaign.name,
        value: campaign.id,
        campaignId: campaign.campaignId,
      }));
      setLists((prevLists) => ({
        ...prevLists,
        ['campaigns']: mapped,
      }));

      return mapped;
    } catch (error) {
      return [];
    }
  };

  const fetchValidationSettings = async (marketerCode: string) => {
    const data = await fetchValidationTemplates(marketerCode);
    if (data?.data) {
      const settings = data.data.map((item: any) => ({
        label: item.name,
        value: item.id,
        tenant: item.tenant,
      }));
      setLists((prevLists) => ({
        ...prevLists,
        ['validationTemplates']: settings || [],
      }));
    }
  };

  useEffect(() => {
    if (lists?.validationTemplates?.length && !lineItemId) {
      const defaultTemplate = lists.validationTemplates.find(
        (item: any) => item.tenant?.code === 'DEFAULT',
      );
      if (defaultTemplate) {
        form.setFieldsValue({ validationSettingsId: defaultTemplate.value });
      }
    }
  }, [lists.validationTemplates]);

  const processedFields = processFieldPermissions(
    BasicDetailsSchema || [],
    disabledFields,
  );

  const groupedFields = processedFields.reduce(
    (acc, field) => {
      const group = field.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const prefillFormWithCampaignData = async () => {
    await fetchLists();

    if (campaignData && campaignUuid) {
      const marketerCode = campaignData.tenantCode;

      form.setFieldsValue({
        marketerCode: marketerCode,
        marketer: campaignData.marketer,
        tenantCode: marketerCode,
      });

      previousMarketerCode.current = marketerCode;

      const filteredCampaigns = await fetchAndFilterCampaigns(marketerCode);
      fetchValidationSettings(marketerCode);

      const matchedCampaign = filteredCampaigns?.find(
        (c: { value: any }) => c.value === campaignData.id,
      );

      if (matchedCampaign) {
        form.setFieldsValue({
          campaignId: matchedCampaign.value,
          campaignName: matchedCampaign.label,
          campaignIdNumber: matchedCampaign.campaignId,
        });
      }

      const updatedDisabledFields = {
        marketerCode: !!marketerCode,
        marketer: !!campaignData.marketer,
        tenantCode: !!marketerCode,
        campaignId: !!campaignData.id,
        campaignName: !!campaignData.name,
        campaignIdNumber: !!campaignData.campaignId,
      };
      setDisabledFields(updatedDisabledFields);
    }
  };

  useEffect(() => {
    prefillFormWithCampaignData();
  }, [campaignData, campaignUuid]);

  const fetchPacingData = async (pacingFields: IPacingRequestData) => {
    try {
      const data = await generatePacingChart(pacingFields);
      if (data?.data) {
        setPacingSchedule(data?.data);
      } else {
        setPacingSchedule([]);
      }
    } catch (error) {
    } finally {
    }
  };

  const fetchDebouncedPacingData = debounce((data: IPacingRequestData) => {
    fetchPacingData(data);
  }, 500);

  useEffect(() => {
    const data = {
      leadGoal: allFields?.targetLeadGoal,
      targetStartDate: allFields?.lineItemTargetStartDate
        ? formatDate(allFields?.lineItemTargetStartDate)
        : undefined,
      targetEndDate: allFields?.lineItemTargetEndDate
        ? formatDate(allFields?.lineItemTargetEndDate)
        : undefined,
      selectedPacing: allFields?.pacing,
    };

    if (
      data.leadGoal &&
      data.targetStartDate &&
      data.targetEndDate &&
      data.selectedPacing
    ) {
      fetchDebouncedPacingData(data as IPacingRequestData);
    }

    return () => {
      fetchDebouncedPacingData.cancel();
    };
  }, [allFields]);

  useEffect(() => {
    const hasChanged = getChangedFields(
      formatLineItemFormData(lineItemDetails!),
      allFields,
    );
    setHasChanges(Object.keys(hasChanged).length > 0);
  }, [allFields, lineItemDetails]);
  const fetchInitialFileLists = async () => {
    if (!lineItemDetails) return;

    const assetFileIds = lineItemDetails.assetFileIds ?? [];
    let enrichedAssetFiles: any[] = [];

    if (
      Array.isArray(assetFileIds) &&
      assetFileIds.length > 0 &&
      !assetFileIds.every((id) => id === null)
    ) {
      const result = await fetchMultipleFileDetails(assetFileIds);
      enrichedAssetFiles = result?.data?.map((file: any) => ({
        ...file,
        id: file.id,
        uid: file.uid,
        name: file.filename,
        status: 'done',
      }));

      form.setFieldValue('assetFileIds', enrichedAssetFiles);
    }
    const deliveryTemplateId = lineItemDetails.deliveryTemplateId;

    if (typeof deliveryTemplateId === 'string') {
      const detail = await fetchFileDetails(deliveryTemplateId);

      if (detail?.id) {
        const enrichedDeliveryTemplate = {
          id: detail.id,
          uid: detail.id,
          name: detail.filename,
          status: 'done',
          ...detail,
        };

        form.setFieldValue('deliveryTemplateId', enrichedDeliveryTemplate);
      }
    }
  };

  useEffect(() => {
    fetchInitialFileLists();
  }, [lineItemDetails, form]);

  const handleCancel = () => {
    navigate(`/campaign-management/line-items`);
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout='vertical'>
      <Row
        gutter={16}
        justify='start'
        style={{ paddingLeft: '0.5rem', marginBottom: '2rem' }}>
        <Text
          style={{
            color: '#464343',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {t('pages.lineItems.label.requiredInfo')}
        </Text>
      </Row>
      {Object.keys(groupedFields).map((group) => (
        <Row key={group} gutter={16}>
          {groupedFields[group]
            .sort(
              (a: { order: number }, b: { order: number }) => a.order - b.order,
            )
            .map((field: any, index: React.Key | null | undefined) => {
              if (field.hidden) {
                return (
                  <Form.Item
                    key={index}
                    name={field.field}
                    className='input-control form-control-item'
                    hidden>
                    {renderField(
                      field,
                      lists,
                      pacingSchedule,
                      form,
                      marketerCode,
                      {
                        assetFiles: form.getFieldValue('assetFileIds'),
                        deliveryTemplateFile:
                          form.getFieldValue('deliveryTemplateId'),
                      },
                    )}
                  </Form.Item>
                );
              }
              return (
                <Col key={index} span={field.span || 10}>
                  <Form.Item
                    label={
                      field.fieldType === 'checkbox' ||
                      field.fieldType === 'pacingChart'
                        ? ''
                        : field.label
                    }
                    name={field.field}
                    rules={field.rules || []}
                    className='input-control form-control-item'>
                    {renderField(
                      field,
                      lists,
                      pacingSchedule,
                      form,
                      marketerCode,
                      {
                        assetFiles: form.getFieldValue('assetFileIds'),
                        deliveryTemplateFile:
                          form.getFieldValue('deliveryTemplateId'),
                      },
                    )}
                  </Form.Item>
                </Col>
              );
            })}
        </Row>
      ))}
      <Flex
        justify='end'
        gap='0.5rem'
        style={{ marginBottom: '3rem', marginRight: '2rem' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        {isSubmitting ? (
          <LoaderButton />
        ) : (
          <Button htmlType='submit' type='primary'>
            {lineItemId ? 'Next' : 'Create & Next'}
          </Button>
        )}
      </Flex>
    </Form>
  );
};
