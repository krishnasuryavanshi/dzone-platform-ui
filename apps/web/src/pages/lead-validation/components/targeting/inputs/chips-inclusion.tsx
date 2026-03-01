import { type FC, useEffect, useState } from 'react';
import { Flex, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useValidationSettingStore } from '../../../stores/use-validation-settings-store';
import { fetchFileUploadMetadata } from '../../../services';
import { fileSortAndUpload } from '../../../lib/utils';
import { TargetingFile } from './targeting-file';
import { ChipsInput } from './chips-input';

interface Props {
  attribute: Record<string, any>;
  sectionName: string;
}

export const ChipsInclusion: FC<Props> = ({ attribute, sectionName }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>[]>([]);
  const [options, setOptions] = useState<Record<string, any>[]>([]);
  const [inclusionFileMetadata, setInclusionFileMetadata] = useState<Record<string, any> | null>(
    null,
  );
  const [inputMethod, setInputMethod] = useState('manual');

  const { selectedValues, setSelectedValues, settingMetadata } =
    useValidationSettingStore();

  useEffect(() => {
    fetchFileUploadMeta(attribute.fileMetadataType?.inclusion);
  }, [attribute]);

  useEffect(() => {
    const selType = selectedValues?.[sectionName]?.[attribute.name]?.type;
    if (selType) {
      if (selType === 'OPTIONS') {
        setOptions(selectedValues[sectionName][attribute.name].data || []);
        setUploadedFiles([]);
        setInputMethod('manual');
      } else {
        setOptions([]);
        setUploadedFiles(selectedValues[sectionName][attribute.name].data || []);
        setInputMethod('upload');
      }
    } else {
      setOptions([]);
      setUploadedFiles([]);
    }
  }, [selectedValues]);

  const fetchFileUploadMeta = async (fileTypeName: string) => {
    try {
      const result = await fetchFileUploadMetadata(fileTypeName);
      setInclusionFileMetadata(result?.data || null);
    } catch {
      /* silent */
    }
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

  const handleRemoveFile = (file: Record<string, any>) => {
    const sectionSelection = selectedValues?.[sectionName];
    const filtered =
      sectionSelection?.[attribute.name]?.data?.filter(
        (f: Record<string, any>) => f.id !== file.id,
      ) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: filtered.length ? { type: 'INCLUSION', data: filtered } : null,
    });
  };

  const handleAddOption = (values: Record<string, any>[]) => {
    const sectionSelection = selectedValues?.[sectionName];
    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: { type: 'OPTIONS', data: values },
    });
  };

  const handleRemoveOption = (value: string) => {
    const sectionSelection = selectedValues?.[sectionName];
    const filtered =
      sectionSelection?.[attribute.name]?.data?.filter((val: string) => val !== value) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: filtered.length ? { type: 'OPTIONS', data: filtered } : null,
    });
  };

  const handleMethodChange = (e: RadioChangeEvent) => {
    setInputMethod(e.target.value);
    setSelectedValues(sectionName, {
      ...selectedValues?.[sectionName],
      [attribute.name]: null,
    });
  };

  return (
    <Flex vertical gap="1rem" style={{ width: '100%' }}>
      <Flex
        style={{
          border: '1px solid #B9B7B75C',
          borderRadius: '0.4rem',
          padding: '1rem 1.25rem',
          width: '100%',
          alignItems: 'flex-start',
        }}>
        <Radio value="manual" checked={inputMethod === 'manual'} onChange={handleMethodChange} />
        <div
          style={{
            width: '100%',
            pointerEvents: inputMethod !== 'manual' ? 'none' : 'auto',
            opacity: inputMethod !== 'manual' ? 0.5 : 1,
          }}>
          <ChipsInput
            handleOptionChange={(vals) => handleAddOption(vals as any)}
            handleRemoveOption={handleRemoveOption}
            options={options as any as string[]}
          />
        </div>
      </Flex>

      <Flex
        align="flex-start"
        gap="1rem"
        style={{
          border: '1px solid #B9B7B75C',
          borderRadius: '0.4rem',
          padding: '1rem 1.25rem',
          width: '100%',
        }}>
        <Radio value="upload" checked={inputMethod === 'upload'} onChange={handleMethodChange} />
        <div
          style={{
            width: '100%',
            pointerEvents: inputMethod !== 'upload' ? 'none' : 'auto',
            opacity: inputMethod !== 'upload' ? 0.5 : 1,
          }}>
          <TargetingFile
            acceptedFileTypes={inclusionFileMetadata?.types || []}
            value={uploadedFiles}
            handleRemoveFile={handleRemoveFile}
            onFileChange={handleFileChange}
            isDisabled={isDisabled}
            isLoading={isLoading}
          />
        </div>
      </Flex>
    </Flex>
  );
};
