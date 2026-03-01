import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryState } from '@dzone/shared-lib';
import { usePermissionCheck } from '@dzone/shared-auth';
import { LeadValidationSettingsActionsEnum } from '@dzone/shared-lib';
import { Hideable } from '@dzone/shared-ui';
import { fetchAllLeadValidationSettings } from '../../services';
import { IValidationSettingRow } from '../../lib/types';
import { ValidationSettingList } from './validation-setting-list';
import { ValidationSettingListPagination } from './validation-setting-list-pagination';
import { CreateNewValidationSettingAction } from './create-new-validation-setting-action';

export const ValidationSettingListContainer: FC = () => {
  const navigate = useNavigate();
  const [validationSettingsList, setValidationSettingsList] = useState<IValidationSettingRow[]>([]);
  const { queryState, setQueryState } = useQueryState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const canCreate = usePermissionCheck(LeadValidationSettingsActionsEnum.Create);

  useEffect(() => {
    fetchList();
  }, [pageSize, currentPage]);

  useEffect(() => {
    if (queryState) {
      const pageNo = Number(queryState.page);
      const size = Number(queryState.pageSize);
      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 },
        ]);
      }
    }
  }, [queryState]);

  const handlePaginationChange = (page: number, size: number) => {
    setQueryState([
      { name: 'page', value: page },
      { name: 'pageSize', value: size },
    ]);
  };

  const fetchList = async () => {
    const data = await fetchAllLeadValidationSettings(currentPage - 1, pageSize);
    if (data) {
      setTotalRecords(data?.total);
      setValidationSettingsList(data.data);
    }
  };

  const handleRowClick = (row: IValidationSettingRow) => {
    navigate(
      `/lead-validation-settings/organizations/${row.tenant.code}/settings/${row.id}`,
    );
  };

  return (
    <div>
      <Hideable show={canCreate}>
        <CreateNewValidationSettingAction />
      </Hideable>
      <ValidationSettingList
        validationSettings={validationSettingsList}
        handleRowClick={handleRowClick}
      />
      <ValidationSettingListPagination
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={pageSize}
        handlePaginationChange={handlePaginationChange}
      />
    </div>
  );
};
