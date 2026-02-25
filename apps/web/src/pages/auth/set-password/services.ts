import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const setPassword = async (token: string, password: string) => {
  const { data } = await axios.post(
    `${baseURL}/api/rbac-service/users/set-password`,
    { token, password },
  );
  return data;
};
