import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const resetPassword = async (email: string) => {
  const { data } = await axios.patch(
    `${baseURL}/api/rbac-service/users/reset-password/${encodeURIComponent(email)}`,
  );
  return data;
};
