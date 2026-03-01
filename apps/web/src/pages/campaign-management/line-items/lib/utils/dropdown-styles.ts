import { CLR_WHITE, DZONE_CLR_BLACK, DZONE_CLR_GRAY_4 } from '@dzone/shared-lib';
import { CSSProperties } from 'react';

export interface DropdownStyleConfig {
  hasSelected: boolean;
  isResponsive?: boolean;
  minWidth?: string;
  isLoading?: boolean;
}

export const getDropdownLabelStyle = (
  _hasSelected: boolean,
  isResponsive?: boolean,
): CSSProperties => {
  return {
    fontWeight: 400,
    fontSize: '1rem',
    color: DZONE_CLR_BLACK,
    ...(isResponsive && window.innerWidth < 480 ? { fontSize: '0.95rem' } : {}),
  };
};

export const getDropdownBadgeStyle = (_hasSelected: boolean): CSSProperties => {
  return {
    background: DZONE_CLR_BLACK,
    color: CLR_WHITE,
    borderRadius: '50%',
    minWidth: 20,
    height: 20,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
  };
};

export const getDropdownButtonStyle = (
  config: DropdownStyleConfig,
): CSSProperties => {
  const { hasSelected, minWidth = '10rem' } = config;

  return hasSelected
    ? {
        background: DZONE_CLR_GRAY_4,
        color: DZONE_CLR_BLACK,
        borderRadius: 8,
        fontWeight: 400,
        padding: '0.5rem 0.8rem 0.5rem 1rem',
        boxShadow: 'none',
        border: 'none',
        fontSize: '1rem',
        transition: 'all 0.2s',
        minWidth,
        height: '2.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
      }
    : {
        background: DZONE_CLR_GRAY_4,
        color: DZONE_CLR_BLACK,
        borderRadius: 8,
        fontWeight: 400,
        padding: '0.5rem 0.8rem 0.5rem 1rem',
        boxShadow: 'none',
        fontSize: '1rem',
        transition: 'all 0.2s',
        minWidth,
        height: '2.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
      };
};

export const dropdownIconStyle: CSSProperties = {
  fontSize: '0.875rem',
  marginLeft: 'auto',
};

export const dropdownSpaceStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
};

export const dropdownLabelSpaceStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};
