import { type FC, useEffect, useState } from 'react';
import { Flex, Typography } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { fetchFileUploadMetadata } from '../../../services';
import { fileSortAndUpload } from '../../../lib/utils';
import { TargetingFile } from './targeting-file';

const { Text } = Typography;

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

export const TargetingInclusion: FC<Props> = ({ attribute, sectionName }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>[]>([]);
  const [inclusionFileMetadata, setInclusionFileMetadata] = useState<Record<string, any> | null>(
    null,
  );

  const { selectedValues, setSelectedValues, settingMetadata } = useValidationSettingStore();

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data) {
      setUploadedFiles(selectedValues[sectionName][attribute.name].data);
    } else {
      setUploadedFiles([]);
    }
  }, [selectedValues]);

  useEffect(() => {
    fetchFileUploadMeta(attribute.fileMetadataType?.inclusion);
  }, [attribute]);

  const fetchFileUploadMeta = async (fileTypeName: string) => {
    try {
      const result = await fetchFileUploadMetadata(fileTypeName);
      setInclusionFileMetadata(result?.data || null);
    } catch {
      /* silent */
    }
  };

  const handleRemoveFile = (file: Record<string, any>) => {
    const sectionSelection = selectedValues?.[sectionName];
    const filteredFiles =
      sectionSelection?.[attribute.name]?.data?.filter(
        (f: Record<string, any>) => f.id !== file.id,
      ) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: filteredFiles.length ? { type: 'INCLUSION', data: filteredFiles } : null,
    });
  };

  const handleFileChange = async (fileObject: Record<string, any>) => {
    setIsLoading(true);
    setIsDisabled(true);
    try {
      const uploaded = await fileSortAndUpload(
        fileObject,
        inclusionFileMetadata as Record<string, any>,
        settingMetadata?.tenantCode,
        attribute.fileMetadataType?.inclusion,
      );

      const sectionSelection = selectedValues?.[sectionName];
      const existing = sectionSelection?.[attribute.name]?.data || [];

      setSelectedValues(sectionName, {
        ...sectionSelection,
        [attribute.name]: { type: 'INCLUSION', data: [...existing, ...uploaded] },
      });
    } catch {
      /* silent */
    }
    setIsLoading(false);
    setIsDisabled(false);
    return true;
  };

  return (
    <div style={{ padding: '1rem 1.25rem' }}>
      <Flex vertical gap="0.75rem">
        <Text strong>{attribute.label}</Text>
        <TargetingFile
          acceptedFileTypes={inclusionFileMetadata?.types || []}
          value={uploadedFiles}
          handleRemoveFile={handleRemoveFile}
          onFileChange={handleFileChange}
          isDisabled={isDisabled}
          isLoading={isLoading}
        />
      </Flex>
    </div>
  );
};
