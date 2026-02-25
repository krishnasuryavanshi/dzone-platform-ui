export function saveFileFromBlob(
  data: BlobPart,
  fileName: string,
  type: string,
) {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  const bufferArray = [data];
  if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
    bufferArray.unshift(bom);
  }
  const blob = new Blob(bufferArray, { type });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
