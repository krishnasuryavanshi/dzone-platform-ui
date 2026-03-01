import { saveFileFromBlob } from '@dzone/shared-lib';

export const handleFileDownload = async (
  resourceFetcher: () => Promise<{ data: Blob; headers: any }>,
  fileNameHeader: string,
) => {
  try {
    const { data, headers } = await resourceFetcher();
    if (data) {
      const contentDisposition =
        typeof headers?.get === 'function'
          ? headers.get(fileNameHeader)
          : headers?.[fileNameHeader];
      const fileName =
        (contentDisposition || '').split('filename=')[1]?.replace(/"/g, '') ||
        'downloaded-file';
      const contentType =
        typeof headers?.get === 'function'
          ? headers.get('content-type')
          : headers?.['content-type'];
      saveFileFromBlob(
        data,
        fileName,
        contentType || 'application/octet-stream',
      );
    }
  } catch (error) {
    // Silent fail for file downloads
  }
};
