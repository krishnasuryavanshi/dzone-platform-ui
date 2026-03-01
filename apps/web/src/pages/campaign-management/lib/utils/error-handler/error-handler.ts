export const handleApiError = (error: any) => {
  try {
    const decoder = new TextDecoder();
    const fileErrorString = decoder.decode(new Uint8Array(error?.data));
    return JSON.parse(fileErrorString);
  } catch (err) {
    return { message: 'An unexpected error occurred', statusCode: 500 };
  }
};
