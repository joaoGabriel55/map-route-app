import type { GeoJSON } from "../domain/GeoJSON";
import { makeHttpClient } from "../infra/http";
import type { Cache } from "../infra/interfaces/cache";
import { MemoCache } from "../infra/memo-cache";

// https://api.openrouteservice.org/v2/directions/driving-car?api_key=&start=8.681495,49.41461&end=8.687872,49.420318
const cache: Cache<GeoJSON> = new MemoCache<GeoJSON>();

const CACHE_TIME = 1000 * 60 * 10;

export const calculateRoute = async (
  from: [string, string],
  to: [string, string]
) => {
  try {
    const http = makeHttpClient(process.env.OPEN_ROUTE_SERVICE_API as string);

    const cacheKey = `${from.join(",")}-${to.join(",")}`;
    const routeCache = cache.getItem(cacheKey);

    if (routeCache) {
      const isValidCache = routeCache.timestamp > Date.now();

      if (isValidCache) {
        console.log("Estou pegando do cache");
        return routeCache.data;
      }

      console.log("Cache invalido");
    }

    const response = await http.get<GeoJSON>("/driving-car", {
      api_key: process.env.OPEN_ROUTE_SERVICE_API_KEY as string,
      start: from.join(","),
      end: to.join(","),
    });

    if (response) cache.addItem(cacheKey, response, CACHE_TIME);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
