import React, { useState, useEffect } from 'react';
import { Typography, Checkbox, Flex, Tag, Input, Button, Dropdown, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { JobTitleTokenType } from '../../lib/enums';
import { fetchRecommendations } from '../../services';
import {
  splitChipValues,
  containsDelimiter,
  shouldCreateChip,
  processPastedText,
  validateChipValue,
} from '../../../../lead-validation/lib/chip-utils';

const { Text } = Typography;

// Styles as objects for reuse
const inlineStyles = {
  recommendationDropdownContainer: {
    background: 'white',
    boxShadow: '0 3px 0.375rem rgba(0, 0, 0, 0.16)',
    borderRadius: '0.5rem',
    padding: '1rem',
    width: '22rem',
    maxWidth: '90vw',
  },
  recommendationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f0f0f0',
  },
  recommendationTitle: {
    fontWeight: 600,
    color: '#333',
  },
  recommendationNote: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '0.75rem',
    lineHeight: 1.4,
  },
  recommendationsList: {
    maxHeight: '18.75rem',
    overflowY: 'auto',
    marginBottom: '0.75rem',
  },
  recommendationGroup: {
    marginBottom: '0.75rem',
  },
  recommendationGroupTitle: {
    fontWeight: 500,
    marginBottom: '0.375rem',
  },
  selectAllContainer: {
    borderTop: '1px solid #f0f0f0',
    paddingTop: '0.75rem',
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    gap: '0.5rem',
  },
  noRecommendationsContainer: {
    padding: '1rem',
    textAlign: 'center' as const,
    color: '#666',
  },
};

interface Chip {
  id: string;
  label: string;
  type?: string;
}

interface ChipsEditProps {
  values: Chip[];
  onChange: (chips: Chip[]) => void;
  label: string;
  placeholder?: string;
}

export const ChipsEdit: React.FC<ChipsEditProps> = ({
  values,
  onChange,
  label,
  placeholder = 'Add New',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [recommendedJobTitles, setRecommendedJobTitles] = useState<
    Record<string, any>[]
  >([]);
  const [isRecommendedJobTitlesLoading, setIsRecommendedJobTitlesLoading] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<
    string[]
  >([]);

  const isJobTitleField =
    label.toLowerCase().includes('job title') ||
    label.toLowerCase().includes('jobtitle');

  useEffect(() => {
    if (recommendedJobTitles.length > 0) {
      const existingLabels = values.map((v) => v.label.toLowerCase());
      const alreadySelectedValues = recommendedJobTitles.flatMap((item) =>
        (item.children || [])
          .filter((child: any) =>
            existingLabels.includes((child.label || '').toLowerCase()),
          )
          .map((child: any) => child.value),
      );
      setSelectedRecommendations(alreadySelectedValues);
    }
  }, [values, recommendedJobTitles]);

  /** Process multiple values from comma-separated input */
  const processMultipleValues = (input: string) => {
    if (input.includes(';')) {
      notification.error({
        message:
          'Semicolon (;) is not allowed. Only letters, numbers, spaces, "&" and "-" are allowed.',
      });
      return false;
    }

    const existingLabels = values.map((chip) => chip.label);

    const valuesArr = splitChipValues(input);
    const invalidValues = valuesArr.filter((v) => !validateChipValue(v));

    if (invalidValues.length > 0) {
      notification.error({
        message: `Invalid values removed: ${invalidValues.join(', ')}`,
      });
    }

    const validValues = valuesArr.filter(validateChipValue);

    const { newValues, duplicates } = processPastedText(
      validValues.join(','),
      existingLabels,
    );

    const newChips: Chip[] = newValues.map((value) => ({
      id: value,
      label: value,
      type: isJobTitleField ? JobTitleTokenType.UserEntered : undefined,
    }));

    if (newChips.length > 0) {
      onChange([...values, ...newChips]);
      if (isJobTitleField && newChips[0])
        fetchRecommendedJobTitles(newChips[0].label);
    }

    if (duplicates.length > 0) {
      notification.error({
        message: `The following values already exist: ${duplicates.join(', ')}`,
      });
    }

    return newChips.length > 0;
  };

  /** Add new chip manually */
  const handleAddNew = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    if (!validateChipValue(trimmedValue)) {
      notification.error({
        message: `Invalid characters detected. Only letters, numbers, spaces, "&" and "-" are allowed.`,
      });
      return;
    }

    if (containsDelimiter(trimmedValue)) {
      const added = processMultipleValues(trimmedValue);
      if (added) setInputValue('');
      return;
    }

    const exists = values.some(
      (chip) => chip.label.toLowerCase() === trimmedValue.toLowerCase(),
    );
    if (exists) {
      notification.error({
        message: `${trimmedValue} already exists`,
      });
      return;
    }

    const newChip: Chip = {
      id: trimmedValue,
      label: trimmedValue,
      type: isJobTitleField ? JobTitleTokenType.UserEntered : undefined,
    };

    onChange([...values, newChip]);
    if (isJobTitleField) fetchRecommendedJobTitles(trimmedValue);
    setInputValue('');
  };

  /** Handle paste event */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const valuesArr = splitChipValues(pastedText);
    const invalidValues = valuesArr.filter((v) => !validateChipValue(v));

    if (invalidValues.length > 0) {
      notification.error({
        message: `Invalid values removed: ${invalidValues.join(', ')}`,
      });
    }

    processMultipleValues(pastedText);
    setInputValue('');
  };

  /** Remove chip */
  const handleRemove = (chip: Chip) => {
    onChange(values.filter((val) => val.id !== chip.id));
  };

  const fetchRecommendedJobTitles = async (tag: string) => {
    setIsRecommendedJobTitlesLoading(true);
    try {
      const jtRecommendations = await fetchRecommendations('job_title', tag);
      if (!jtRecommendations) return;

      let extractedRecommendations = [];

      if (Array.isArray(jtRecommendations)) {
        extractedRecommendations = jtRecommendations;
      } else {
        extractedRecommendations = [jtRecommendations];
      }

      setRecommendedJobTitles(extractedRecommendations);
      setDropdownOpen(true);
    } catch (error) {
    } finally {
      setIsRecommendedJobTitlesLoading(false);
    }
  };

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedRecommendations(checkedValues);
  };

  const handleSelectAllChange = () => {
    const allValues = recommendedJobTitles.flatMap((item) =>
      (item.children || []).map((child: any) => child.value),
    );

    if (selectedRecommendations.length < allValues.length) {
      setSelectedRecommendations(allValues);
    } else {
      setSelectedRecommendations([]);
    }
  };

  const handleAddSelectedRecommendations = () => {
    const selectedLabels: Record<string, string> = {};

    recommendedJobTitles.forEach((item) => {
      (item.children || []).forEach((child: any) => {
        if (selectedRecommendations.includes(child.value)) {
          selectedLabels[child.value] = child.label || '';
        }
      });
    });

    const existingLabels = values.map((v) => v.label.toLowerCase());

    const newChips = selectedRecommendations
      .filter(
        (value) =>
          selectedLabels[value] &&
          !existingLabels.includes(selectedLabels[value].toLowerCase()),
      )
      .map((value) => ({
        id: selectedLabels[value],
        label: selectedLabels[value],
        type: JobTitleTokenType.AIRecommended,
      }));

    if (newChips.length) {
      onChange([...values, ...newChips]);
    }

    setDropdownOpen(false);
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open);
  };

  const renderDropdown = () => {
    if (isRecommendedJobTitlesLoading) {
      return (
        <Flex style={inlineStyles.recommendationDropdownContainer}>
          <Flex justify='center' align='center' style={{ padding: '1.5rem' }}>
            <LoadingOutlined style={{ fontSize: '2rem' }} />
          </Flex>
        </Flex>
      );
    }

    if (!recommendedJobTitles.length) {
      return (
        <Flex style={inlineStyles.recommendationDropdownContainer}>
          <Flex
            justify='center'
            align='center'
            style={inlineStyles.noRecommendationsContainer}>
            No recommendations available
          </Flex>
        </Flex>
      );
    }

    const allValues = recommendedJobTitles.flatMap((item) =>
      (item.children || []).map((child: any) => child.value),
    );

    const isAllSelected =
      selectedRecommendations.length === allValues.length &&
      allValues.length > 0;

    const existingLabels = values.map((v) => v.label.toLowerCase());

    return (
      <Flex vertical style={inlineStyles.recommendationDropdownContainer}>
        <Flex
          justify='space-between'
          align='center'
          style={inlineStyles.recommendationHeader}>
          <Text strong style={inlineStyles.recommendationTitle}>
            Suggestions
          </Text>
          <Button
            type='link'
            onClick={() => setSelectedRecommendations([])}
            style={{ padding: 0 }}>
            Unselect All
          </Button>
        </Flex>

        <Text style={inlineStyles.recommendationNote}>
          Note: Please consider selecting the similar job titles suggested below
          to ensure that no valuable leads are rejected during validation
          process.
        </Text>

        <Flex justify='space-between' style={inlineStyles.selectAllContainer}>
          <Checkbox
            checked={isAllSelected}
            onChange={handleSelectAllChange}
            style={{ fontWeight: 600 }}>
            Select All
          </Checkbox>
        </Flex>

        <Flex
          vertical
          style={inlineStyles.recommendationsList as React.CSSProperties}>
          {recommendedJobTitles.map((group, groupIndex) => {
            if (!group.name || !group.children || !group.children.length)
              return null;

            return (
              <Flex
                vertical
                key={`group-${groupIndex}`}
                style={inlineStyles.recommendationGroup}>
                <Text strong style={inlineStyles.recommendationGroupTitle}>
                  {group.name}
                </Text>
                <Checkbox.Group
                  value={selectedRecommendations}
                  onChange={handleCheckboxChange}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                  }}>
                  {group.children.map((item: any) => {
                    const isAlreadyAdded = existingLabels.includes(
                      (item.label || '').toLowerCase(),
                    );

                    return (
                      <Checkbox
                        key={item.value}
                        value={item.value}
                        disabled={isAlreadyAdded}
                        style={{ marginLeft: 0 }}>
                        {item.label}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </Flex>
            );
          })}
        </Flex>

        <Flex justify='flex-end' gap='0.5rem' style={inlineStyles.buttonsContainer}>
          <Button onClick={() => setDropdownOpen(false)}>Cancel</Button>
          <Button
            type='primary'
            onClick={handleAddSelectedRecommendations}
            disabled={selectedRecommendations.length === 0}>
            Add
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex vertical>
      <Flex
        align='center'
        justify='space-between'
        gap='0.5rem'
        style={{ marginBottom: '1rem' }}>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;

            if (!validateChipValue(value) && value !== '') {
              notification.error({
                message: `Invalid character detected. Only letters, numbers, spaces, "&" and "-" are allowed.`,
              });
              return;
            }

            if (containsDelimiter(value)) {
              const added = processMultipleValues(value);
              if (added) {
                setInputValue('');
              } else {
                const valuesArr = splitChipValues(value);
                const lastPart = valuesArr[valuesArr.length - 1] || '';
                setInputValue(lastPart);
              }
            } else {
              setInputValue(value);
            }
          }}
          onPressEnter={handleAddNew}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            if (shouldCreateChip(e.key) && inputValue.trim()) {
              e.preventDefault();
              handleAddNew();
            }
          }}
          style={{ border: 'none', boxShadow: 'none' }}
        />
        <Flex gap='0.5rem' align='center'>
          {isJobTitleField && (
            <Dropdown
              open={dropdownOpen}
              onOpenChange={handleDropdownOpenChange}
              dropdownRender={renderDropdown}
              arrow={true}
              trigger={['click']}
              placement='bottomLeft'>
              <Button
                onClick={() => {
                  if (inputValue.trim() && !isRecommendedJobTitlesLoading) {
                    fetchRecommendedJobTitles(inputValue.trim());
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                }}
                title='Get suggestions'
                disabled={isRecommendedJobTitlesLoading}>
                {isRecommendedJobTitlesLoading ? (
                  <LoadingOutlined
                    style={{ fontSize: '1.25rem', color: '#4F46E5' }}
                  />
                ) : (
                  <LoadingOutlined
                    style={{ fontSize: '1.25rem', color: '#4F46E5' }}
                  />
                )}
              </Button>
            </Dropdown>
          )}
        </Flex>
      </Flex>

      <Flex
        vertical
        style={{
          borderRadius: '0.375rem',
          padding: '1rem',
          background: '#F9FAFB',
        }}>
        <Flex wrap='wrap' gap='0.5rem'>
          {values.map((chip) => (
            <Tag
              key={chip.id}
              closable
              onClose={() => handleRemove(chip)}
              style={{
                backgroundColor:
                  hoveredItem === chip.id ? '#EBF3FE' : '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
              }}
              onMouseEnter={() => setHoveredItem(chip.id)}
              onMouseLeave={() => setHoveredItem(null)}>
              {chip.label}
            </Tag>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
