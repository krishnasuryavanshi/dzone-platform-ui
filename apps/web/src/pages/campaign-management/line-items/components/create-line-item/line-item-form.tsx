import { StepperFormFooter } from '@/components/modals/form/stepper-form-footer';
import { OptionsKeys, RestrictedAccessKeys, StorageKey } from '@dzone/shared-lib';
import { useRestrictedAccess } from '../../../campaigns/lib/hooks';
import { sanitizeData } from '@dzone/shared-lib';
import { getFormDataFromCookie } from '@/services/cookie-stepper-form';
import { Form } from 'antd';
import useForm from 'antd/lib/form/hooks/useForm';
import { cloneDeep, debounce } from 'lodash-es';
import { useNavigate } from 'react-router';
import {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useFormStep } from '../../../campaigns/lib/hooks';
import {
  getFormFields,
  getUsersOptions,
  setupInitialValues,
} from '../../../campaigns/lib/utils';
import { CreateFormContent } from '../../../components';
import { useUpdateQueryState } from '../../../lib/hooks/use-update-query-state';
import {
  extractFieldsStepwise,
  extractRequiredFields,
  isObjectModified,
} from '../../../lib/utils';
import { LineItemFormConfig } from '../../config/forms';
import { LineItemFields, LineItemSections } from '../../lib/enums';
import { ICustomRangeDetails, ILineItem } from '../../lib/types';
import {
  getCurrentLineItemStepTargetObject,
  getFormDetails,
  updateFormCollaboratorsValues,
} from '../../lib/utils';
import {
  attachFieldHandlers,
  isIntegrateConvertrRequired,
} from '../../lib/utils/attach-handlers';
import {
  handleCancel,
  handleNext,
  handleSave,
} from '../../lib/utils/line-item-action-handlers';
import { setupInitialStates } from '../../lib/utils/setup-initial-states';
import { fetchPrefilledListsByStep } from '../../services';
import { fetchAllCampaigns } from '../../../campaigns/services';
import { ICampaign } from '../../../campaigns/lib/types';
import { useLineItemStore } from '../../stores';

interface ILineItemForm {
  step: number;
  campaignId?: string;
  campaignUuid?: string;
  campaignName?: string;
  tenantCode?: string | string[];
  lineItemDetails?: ILineItem;
  customRangeLimit: ICustomRangeDetails;
  userId?: string;
  campaignData?: ICampaign;
  isDzoneUser?: boolean;
}

export const LineItemForm: FC<ILineItemForm> = ({
  step,
  campaignUuid,
  tenantCode,
  campaignData,
  lineItemDetails,
  customRangeLimit,
  userId,
  isDzoneUser,
}) => {
  const navigate = useNavigate();
  const { updateQueryParams } = useUpdateQueryState();
  const previousMarketerCodeRef = useRef<string | undefined>(undefined);

  const [, setLoading] = useState(false);
  const {
    formStepDetails,
    setFormStepDetailsInfo,
    updateFormStepDetails,
    isFormStepInitialized,
    clearFormStepDetailsInfo,
  } = useFormStep();
  const [showSaveAndCloseButton, setShowSaveAndCloseButton] =
    useState<boolean>(false);
  const [lists, setLists] = useState<Record<string, any[]>>({});
  const [collaborativeCampaignData] = useState<
    Record<string, any | any[]>
  >({});
  const [existingLineItemDetails, setExistingLineItemDetails] =
    useState<Record<string, any>>();
  const [form] = useForm();
  const [requiredFormFields, setrequiredFormFields] = useState<string[]>([]);
  const { updateTargetObject, clearUnsavedData } = useLineItemStore();

  const isTargetCplCreateRestricted = useRestrictedAccess(
    RestrictedAccessKeys.CplFieldInLineItemCreate,
  );
  const isTargetCplEditRestricted = useRestrictedAccess(
    RestrictedAccessKeys.CplFieldInLineItemEdit,
  );

  const setupExistingLineItemDetails = () => {
    const { id, finishedStepId } = getFormDataFromCookie(
      StorageKey.LineItemForm,
    );
    setExistingLineItemDetails({ id, finishedStepId });
  };

  const isEditing = !!existingLineItemDetails?.id;

  const patchFormValues = (values: any) => {
    form.setFieldsValue(values);
  };

  const fetchLists = async () => {
    try {
      const fetchedLists = await fetchPrefilledListsByStep(step, userId);
      setLists(fetchedLists as any);
    } catch (error) {}
  };

  useEffect(() => {
    if (collaborativeCampaignData) {
      getFormDetails(collaborativeCampaignData, patchFormValues);
    }

    if (
      collaborativeCampaignData?.collaborators &&
      (!lineItemDetails?.collaborators ||
        (lineItemDetails.collaborators &&
          Object.keys(lineItemDetails?.collaborators)?.length === 0))
    ) {
      const data = getUsersOptions(collaborativeCampaignData?.collaborators);
      updateFormCollaboratorsValues(
        data,
        patchFormValues,
        updateFormStepDetails,
      );
    }
  }, [collaborativeCampaignData, lineItemDetails]);

  const fetchAndFilterCampaigns = async (marketerCode: string) => {
    try {
      const allCampaigns = await fetchAllCampaigns();
      const filtered = allCampaigns?.data?.filter(
        (campaign: any) => campaign.tenantCode === marketerCode,
      );
      const mapped = filtered?.map((campaign: ICampaign) => ({
        label: campaign.name,
        value: campaign.id,
        campaignId: campaign.campaignId,
      }));

      setLists((prevLists) => ({
        ...prevLists,
        [OptionsKeys.Campaigns]: mapped,
      }));

      return mapped;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const campaignId = form.getFieldValue('campaignId') || campaignData?.id;

    if (campaignId && lists?.campaigns?.length) {
      const selectedCampaign = lists.campaigns.find((campaign) => {
        return campaign.value === campaignId;
      });
      if (selectedCampaign) {
        patchFormValues({
          campaignId: selectedCampaign.value,
          campaignName: selectedCampaign.label,
          campaignIdNumber: selectedCampaign.campaignId,
        });
      }
    }
  }, [lists?.campaigns, form, campaignUuid, patchFormValues, campaignData]);

  const handleMarketerSelection = useCallback(
    async (marketerCode: string | undefined) => {
      if (!lists?.marketers) return;
      const selectedMarketer = lists.marketers.find(
        (marketer: any) => marketer.tenantCode === marketerCode,
      );

      if (selectedMarketer) {
        patchFormValues({
          marketerCode: selectedMarketer.tenantCode,
          marketer: selectedMarketer.label,
          tenantCode: selectedMarketer.tenantCode,
        });

        const campaigns = await fetchAndFilterCampaigns(
          selectedMarketer.tenantCode,
        );

        const campaignIdFromData = campaignData?.id || campaignUuid;

        if (campaignIdFromData && campaigns?.length) {
          const selectedCampaign = campaigns.find(
            (campaign: { id: string }) => campaign.id === campaignIdFromData,
          );

          if (selectedCampaign) {
            patchFormValues({
              campaignId: selectedCampaign.value,
              campaignName: selectedCampaign.label,
              campaignIdNumber: selectedCampaign.campaignId,
            });
          }
        }
      }
    },
    [
      lists?.marketers,
      patchFormValues,
      fetchAndFilterCampaigns,
      campaignData,
      campaignUuid,
    ],
  );

  useEffect(() => {
    if (!lists?.marketers) return;

    const marketerCode =
      form.getFieldValue(LineItemFields.MarketerCode) ||
      (tenantCode && tenantCode[0]);
    handleMarketerSelection(marketerCode);
  }, [lists?.marketers, isDzoneUser, tenantCode, campaignData]);

  useEffect(() => {
    const getCampaignDetails = async () => {
      if (!isEditing) return;
      if (!lineItemDetails?.tenantCode) return;
      if (!lists?.marketers) return;

      const marketerCode = lineItemDetails?.tenantCode;
      await fetchAndFilterCampaigns(marketerCode!);
      const campaignIdFromData = lineItemDetails?.campaign?.id;

      if (campaignIdFromData && lists?.campaigns?.length) {
        const selectedCampaign = lists?.campaigns.find(
          (campaign) => campaign.campaignId === campaignIdFromData,
        );

        if (selectedCampaign) {
          patchFormValues({
            campaignId: selectedCampaign.value,
            campaignName: selectedCampaign.label,
            campaignIdNumber: selectedCampaign.campaignId,
          });
        }
      }
    };

    getCampaignDetails();
  }, [isEditing, lineItemDetails?.campaign?.id, lists?.marketers]);

  useEffect(() => {
    try {
      setLoading(true);
      clearFormStepDetailsInfo();
      const restrictedFields = getRestrictedFields();
      const formStep = getFormFields(step, cloneDeep(LineItemFormConfig), {
        hiddenFields: restrictedFields,
      });
      setrequiredFormFields(extractRequiredFields(LineItemFormConfig, step));
      if (formStep?.step) {
        fetchLists();
        setupInitialValues(patchFormValues, step, StorageKey.LineItemForm);
        setupExistingLineItemDetails();
        setFormStepDetailsInfo(formStep);
      }
    } catch (error) {
      throw error;
    }
  }, [step]);

  const showSaveAndCloseButtonIfFileChanged = (val: boolean) => {
    setShowSaveAndCloseButton(val);
  };

  useEffect(() => {
    if (isFormStepInitialized) {
      setupInitialStates(
        step,
        form,
        patchFormValues,
        updateFormStepDetails,
        showSaveAndCloseButtonIfFileChanged,
        customRangeLimit,
      );
      attachFieldHandlers(
        step,
        patchFormValues,
        updateFormStepDetails,
        showSaveAndCloseButtonIfFileChanged,
        customRangeLimit,
        form,
      );
      const deliveryMethod = form.getFieldValue(LineItemFields.DeliveryMethod);
      isIntegrateConvertrRequired(deliveryMethod, updateFormStepDetails);
      updateCustomRangeFieldsValue();
      disableFieldSelection(campaignData);
      setLoading(false);
    }
  }, [isFormStepInitialized, campaignData]);

  const updateCustomRangeFieldsValue = () => {
    if (isEditing) {
      if (lineItemDetails?.isCompanySizeEmployeeCountCustom) {
        patchFormValues({
          companySizeEmployeeCountCustomRangeMin:
            lineItemDetails?.companySizeEmployeeCountCustomRangeMin === -2
              ? null
              : lineItemDetails?.companySizeEmployeeCountCustomRangeMin,
          companySizeEmployeeCountCustomRangeMax:
            lineItemDetails?.companySizeEmployeeCountCustomRangeMax === -1
              ? null
              : lineItemDetails?.companySizeEmployeeCountCustomRangeMax,
        });
      }
      if (lineItemDetails?.isCompanySizeRevenueCustom) {
        patchFormValues({
          companySizeRevenueCustomRangeMin:
            lineItemDetails?.companySizeRevenueCustomRangeMin === -2
              ? null
              : lineItemDetails?.companySizeRevenueCustomRangeMin,
          companySizeRevenueCustomRangeMax:
            lineItemDetails?.companySizeRevenueCustomRangeMax === -1
              ? null
              : lineItemDetails?.companySizeRevenueCustomRangeMax,
        });
      }
    }
  };

  const disableFieldSelection = (campaignData?: ICampaign) => {
    if (isEditing) {
      updateFormStepDetails(
        LineItemSections.LineItemDetails,
        LineItemFields.LineItemIdNumber,
        {
          disabled: true,
          hidden: false,
        },
      );
      updateFormStepDetails(
        LineItemSections.LineItemDetails,
        LineItemFields.Status,
        {
          disabled: true,
          hidden: false,
        },
      );
      updateFormStepDetails(
        LineItemSections.CampaignDetails,
        LineItemFields.CampaignId,
        {
          disabled: true,
          hidden: false,
        },
      );
    }
    if (campaignData && Object.keys(campaignData).length > 0) {
      updateFormStepDetails(
        LineItemSections.CampaignDetails,
        LineItemFields.CampaignId,
        {
          disabled: true,
          hidden: false,
        },
      );
      patchFormValues({
        marketerCode: campaignData?.tenantCode,
        tenantCode: campaignData?.tenantCode,
        marketer: campaignData?.marketer,
      });
    }
    if (!isDzoneUser || (isDzoneUser && campaignData?.campaignId)) {
      updateFormStepDetails(
        LineItemSections.MarketerDetails,
        LineItemFields.MarketerCode,
        {
          disabled: true,
          hidden: false,
        },
      );
    } else {
      updateFormStepDetails(
        LineItemSections.MarketerDetails,
        LineItemFields.MarketerCode,
        {
          disabled: false,
          hidden: false,
        },
      );
    }
  };

  const handleSubmit = async () => {
    const isHandled = await handleSave(
      navigate,
      form,
      step,
      existingLineItemDetails,
      requiredFormFields,
      form.getFieldValue('campaignId') ||
        (isEditing ? lineItemDetails?.campaign?.id : campaignData?.id),
      lineItemDetails,
    );

    if (isHandled) {
      clearUnsavedData();
    }
  };

  const handleValueChanges = () => {
    const currentFormData = sanitizeData(form.getFieldsValue()); // use validate function
    const marketerCode = currentFormData[LineItemFields.MarketerCode];

    if (marketerCode && marketerCode !== previousMarketerCodeRef.current) {
      previousMarketerCodeRef.current = marketerCode;
      handleMarketerSelection(marketerCode);
    }
    const currentStepData = sanitizeData(
      getCurrentLineItemStepTargetObject(step, cloneDeep(currentFormData)) ||
        {},
    );
    updateTargetObject(currentStepData);
    if (existingLineItemDetails?.id) {
      const stepsData = extractFieldsStepwise(StorageKey.LineItemForm);

      // Check if we have data for the current step
      if (stepsData) {
        const currentStepData = stepsData[step];

        // If there's no data for the current step, enable the button if there are non-empty fields
        if (!currentStepData) {
          setShowSaveAndCloseButton(true);
          return;
        }
        // Check if there are changes in the current form data
        const hasChanged = isObjectModified(currentFormData, currentStepData);
        let hasRequiredFieldDeletions = false;
        let hasNonRequiredFieldDeletions = false;

        Object.keys(currentStepData).some((key) => {
          const isDeleted =
            (currentFormData[key] === undefined ||
              currentFormData[key] === null ||
              currentFormData[key] === '') &&
            currentFormData[key] !== currentStepData[key];

          if (isDeleted) {
            if (requiredFormFields.includes(key)) {
              hasRequiredFieldDeletions = true;
            } else {
              hasNonRequiredFieldDeletions = true;
            }
          }
        });

        const shouldShowSaveAndCloseButton =
          hasChanged ||
          (hasNonRequiredFieldDeletions && !hasRequiredFieldDeletions);
        if (hasRequiredFieldDeletions) {
          setShowSaveAndCloseButton(false);
        } else {
          setShowSaveAndCloseButton(shouldShowSaveAndCloseButton);
        }
      } else {
        setShowSaveAndCloseButton(false);
      }
    }
  };

  const debouncedFormValueChangeHandler = debounce(handleValueChanges, 500);

  const getRestrictedFields = () => {
    const restrictedFields: LineItemFields[] = [];
    if (isEditing) {
      if (isTargetCplEditRestricted) {
        restrictedFields.push(LineItemFields.TargetCostPerLead);
      }
    } else {
      if (isTargetCplCreateRestricted) {
        restrictedFields.push(LineItemFields.TargetCostPerLead);
      }
    }
    return restrictedFields;
  };

  const onCancel = () => {
    clearUnsavedData();
    handleCancel(navigate);
  };

  return (
    <Form
      className='dz-form'
      {...formStepDetails?.meta}
      form={form}
      onValuesChange={debouncedFormValueChangeHandler}>
      <CreateFormContent
        stepFields={formStepDetails}
        lists={lists}
        form={form}
        entityId={lineItemDetails?.lineItemId}
      />
      <StepperFormFooter
        style={{ position: 'relative', bottom: '1rem', right: '1rem' }}
        title='createLineItem'
        onCancel={onCancel}
        onSaveAndClose={handleSubmit}
        onSubmit={handleSubmit}
        onNext={() =>
          handleNext(
            navigate,
            form,
            step,
            updateQueryParams,
            form.getFieldValue('campaignId') ||
              (isEditing ? lineItemDetails?.campaign?.id : campaignData?.id),
          )
        }
        step={step}
        showSaveAndClose={isEditing ? showSaveAndCloseButton : true}
      />
    </Form>
  );
};
