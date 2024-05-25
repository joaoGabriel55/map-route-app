import axios from "axios";

export const makeHttpClient = (url: string) => {
  const client = axios.create({ baseURL: url });

  return {
    async get<T>(path: string, params?: Record<string, unknown>) {
      const response = await client.get(path, { params });

      return response.data as T;
    },
  };
};
