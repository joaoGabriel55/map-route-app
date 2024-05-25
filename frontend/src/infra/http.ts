import axios from "axios";

type RequestOptions = {
  cacheKey?: string;
  retry?: number;
};

export const makeHttpClient = (url: string) => {
  const client = axios.create({ baseURL: url });

  return {
    async get<T>(
      path: string,
      params?: Record<string, unknown>,
      options?: RequestOptions
    ) {
      if (options?.retry) {
        let retryTimes = 0;

        while (retryTimes < options.retry) {
          console.log({ retryTimes });
          try {
            const response = await client.get(path, { params });
            return response.data as T;
          } catch (error) {
            retryTimes += 1;
          }
        }

        throw new Error("Max retry reached");
      }

      const response = await client.get(path, { params });

      return response.data as T;
    },
  };
};
