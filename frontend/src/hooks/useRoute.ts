import { GeoJSON } from "../domain/GeoJSON";
import { makeHttpClient } from "../infra/http";

const http = makeHttpClient(import.meta.env.VITE_API_URL);

export function useRoute() {
  const getRoute = async (from: [number, number], to: [number, number]) => {
    const response = await http.get<GeoJSON>("/route", { from, to }, { retry: 3 });

    return response;
  };

  return {
    getRoute,
  };
}
