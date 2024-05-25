import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { makeHttpClient } from "../infra/http";
import { MemoCache } from "../infra/memo-cache";
import routeMock from "../__tests__/mocks/routeMock.json";
import { calculateRoute } from "./calculateRoute";

// Mock the http client
jest.mock("../infra/http");
const mockedHttpClient = makeHttpClient as jest.MockedFunction<
  typeof makeHttpClient
>;

jest.mock("../infra/memo-cache");

const from: [string, string] = ["8.681495", "49.41461"];
const to: [string, string] = ["8.687872", "49.420318"];

const fakeApiKey = "fake-api-key";

const httpRequestParams = [
  "/driving-car",
  {
    api_key: fakeApiKey,
    end: "8.687872,49.420318",
    start: "8.681495,49.41461",
  },
];

describe("calculateRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    process.env.OPEN_ROUTE_SERVICE_API_KEY = fakeApiKey;

    mockedHttpClient.mockReturnValue({
      // @ts-ignore
      get: async () => routeMock,
    });
  });

  const getMockSetup = () => {
    const getMock = jest.fn(() => routeMock);
    // @ts-ignore
    mockedHttpClient.mockReturnValue({ get: getMock });

    return getMock;
  };

  const memoCacheSetup = ({ timestamp = Date.now() } = {}) => {
    jest.spyOn(MemoCache.prototype, "getItem").mockReturnValueOnce({
      data: routeMock,
      timestamp,
    });
  };

  describe("success calculation", () => {
    it("returns data from external API", async () => {
      jest.spyOn(console, "log").mockImplementationOnce(jest.fn);
      const getMock = getMockSetup();

      const route = await calculateRoute(from, to);

      expect(route).toMatchObject({ type: "FeatureCollection" });
      expect(console.log).not.toHaveBeenCalledWith("Estou pegando do cache");
      expect(console.log).not.toHaveBeenCalledWith("Cache invalido");
      expect(getMock).toHaveBeenCalledWith(...httpRequestParams);
    });

    it("returns data from valid cache", async () => {
      jest.spyOn(console, "log").mockImplementationOnce(jest.fn);
      const getMock = getMockSetup();

      memoCacheSetup({ timestamp: Date.now() + 10000 });

      const route = await calculateRoute(from, to);

      expect(route).toMatchObject({ type: "FeatureCollection" });
      expect(console.log).toHaveBeenCalledWith("Estou pegando do cache");
      expect(getMock).not.toHaveBeenCalled();
    });

    describe("when cache data is invalid", () => {
      it("returns data from external API", async () => {
        jest.spyOn(console, "log").mockImplementationOnce(jest.fn);
        const getMock = getMockSetup();

        memoCacheSetup();

        const route = await calculateRoute(from, to);

        expect(route).toMatchObject({ type: "FeatureCollection" });
        expect(console.log).not.toHaveBeenCalledWith("Estou pegando do cache");
        expect(console.log).toHaveBeenCalledWith("Cache invalido");
        expect(getMock).toHaveBeenCalledWith(...httpRequestParams);
      });
    });
  });

  describe("failure calculation", () => {
    it("returns error from external API", async () => {
      mockedHttpClient.mockReturnValue({
        // @ts-ignore
        get: async () => {
          throw new Error();
        },
      });

      expect(calculateRoute(from, to)).rejects.toThrow();
    });
  });
});
