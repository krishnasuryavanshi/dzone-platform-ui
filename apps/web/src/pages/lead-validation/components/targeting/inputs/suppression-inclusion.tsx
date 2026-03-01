import { type FC, useEffect, useState } from 'react';
import { Flex, Radio, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { fetchFileUploadMetadata } from '../../../services';
import { fileSortAndUpload } from '../../../lib/utils';
import { TargetingFile } from './targeting-file';

const { Text } = Typography;

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

export const SuppressionInclusion: FC<Props> = ({ sectionName, attribute }) => {
  const [type, setType] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>[]>([]);
  const [fileMetadata, setFileMetadata] = useState<Record<string, any> | null>(null);

  const { selectedValues, setSelectedValues, settingMetadata, isReadOnly } =
    useValidationSettingStore();

  useEffect(() => {
    fetchFileUploadMeta(attribute.fileMetadataType?.inclusion);
    fetchFileUploadMeta(attribute.fileMetadataType?.exclusion);
  }, [attribute]);

  useEffect(() => {
    const selType = selectedValues?.[sectionName]?.[attribute.name]?.type;
    if (selType && ['INCLUSION', 'EXCLUSION'].includes(selType)) {
      setType(selType);
    } else {
      setType(null);
    }
    setUploadedFiles(selectedValues?.[sectionName]?.[attribute.name]?.data || []);
  }, [selectedValues]);

  const fetchFileUploadMeta = async (fileTypeName: string) => {
    try {
      const result = await fetchFileUploadMetadata(fileTypeName);
      const key = fileTypeName.includes('inclusion') ? 'INCLUSION' : 'EXCLUSION';
      setFileMetadata((prev) => ({ ...prev, [key]: result?.data || null }));
    } catch {
      /* silent */
    }
  };

  const handleTypeChange = (e: RadioChangeEvent) => {
    const sectionSelection = selectedValues?.[sectionName];
    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: { type: e.target.value, data: null },
    });
  };

  const handleRemoveFile = (file: Record<string, any>) => {
    const sectionSelection = selectedValues?.[sectionName];
    const filtered =
      sectionSelection?.[attribute.name]?.data?.filter(
        (f: Record<string, any>) => f.id !== file.id,
      ) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: {
        type: sectionSelection?.[attribute.name]?.type,
        data: filtered.length ? filtered : null,
      },
    });
  };

  const handleFileChange = async (
    fileObject: Record<string, any>,
    fileType: 'INCLUSION' | 'EXCLUSION',
  ) => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      const fileTypeName =
        fileType === 'INCLUSION'
          ? attribute.fileMetadataType?.inclusion
          : attribute.fileMetadataType?.exclusion;
      const uploaded = await fileSortAndUpload(
        fileObject,
        fileMetadata?.[fileType] as Record<string, any>,
        settingMetadata?.tenantCode,
        fileTypeName,
      );

      const sectionSelection = selectedValues?.[sectionName];
      const existing = sectionSelection?.[attribute.name]?.data || [];

      setSelectedValues(sectionName, {
        ...sectionSelection,
        [attribute.name]: { type: fileType, data: [...existing, ...uploaded] },
      });
    } catch {
      /* silent */
    }
    setIsLoading(false);
    setIsDisabled(false);
    return true;
  };

  return (
    <Flex style={{ width: '100%' }}>
      <Radio.Group
        value={type}
        onChange={handleTypeChange}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            padding: '1rem 1.25rem',
            border: '1px solid #E5EBF1',
            borderRadius: '0.25rem',
          }}>
          <Radio value="EXCLUSION" disabled={isReadOnly}>
            <RadioContent
              label="Suppression List"
              description="Values in this list will not be accepted during Validation."
              acceptedFileTypes={fileMetadata?.EXCLUSION?.types || []}
              handleOnFileChange={handleFileChange}
              uploadedFiles={type === 'EXCLUSION' ? uploadedFiles : null}
              handleRemoveFile={handleRemoveFile}
              isDisabled={isDisabled || type !== 'EXCLUSION'}
              isLoading={isLoading}
              type="EXCLUSION"
            />
          </Radio>
        </div>
        <div
          style={{
            padding: '1rem 1.25rem',
            border: '1px solid #E5EBF1',
            borderRadius: '0.25rem',
          }}>
          <Radio value="INCLUSION" disabled={isReadOnly}>
            <RadioContent
              label="Inclusion List"
              description="Only Values in this list will be accepted during Validation."
              acceptedFileTypes={fileMetadata?.INCLUSION?.types || []}
              handleOnFileChange={handleFileChange}
              uploadedFiles={type === 'INCLUSION' ? uploadedFiles : null}
              handleRemoveFile={handleRemoveFile}
              isDisabled={isDisabled || type !== 'INCLUSION'}
              isLoading={isLoading}
              type="INCLUSION"
            />
          </Radio>
        </div>
      </Radio.Group>
    </Flex>
  );
};

interface RadioContentProps {
  type: 'INCLUSION' | 'EXCLUSION';
  label: string;
  description: string;
  uploadedFiles: Record<string, any>[] | null;
  handleRemoveFile: (file: Record<string, any>) => void;
  handleOnFileChange: (
    fileObject: Record<string, any>,
    type: 'INCLUSION' | 'EXCLUSION',
  ) => Promise<boolean>;
  isDisabled: boolean;
  acceptedFileTypes: string[];
  isLoading: boolean;
}

const RadioContent: FC<RadioContentProps> = ({
  type,
  label,
  description,
  uploadedFiles,
  handleRemoveFile,
  handleOnFileChange,
  isDisabled,
  acceptedFileTypes,
  isLoading,
}) => {
  const handleFileChange = async (fileObject: Record<string, any>) => {
    return await handleOnFileChange(fileObject, type);
  };

  return (
    <Flex vertical gap="0.75rem" style={{ flex: 1 }}>
      <Text strong>{label}</Text>
      <Text>{description}</Text>
      <div style={{ marginTop: '0.25rem', width: '100%' }}>
        <TargetingFile
          acceptedFileTypes={acceptedFileTypes}
          value={uploadedFiles as Record<string, any>[]}
          handleRemoveFile={handleRemoveFile}
          onFileChange={handleFileChange}
          isDisabled={isDisabled}
          isLoading={isLoading}
        />
      </div>
    </Flex>
  );
};
