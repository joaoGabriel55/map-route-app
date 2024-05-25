import supertest from "supertest";
import { app } from ".";
import { calculateRoute } from "./services/calculateRoute";
import routeMock from "./__tests__/mocks/routeMock.json";

jest.mock("./services/calculateRoute");
const mockedCalculateRoute = calculateRoute as jest.MockedFunction<
  typeof calculateRoute
>;

describe("GET /route", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockedCalculateRoute.mockResolvedValueOnce(routeMock);
  });

  describe("when route query params are valid", () => {
    const url = `/route?from[]=8.681495&from[]=49.41461&to[]=8.687872&to=49.420318`;

    it("returns 200 [OK] status", async () => {
      const response = await supertest(app).get(url);

      expect(response.status).toBe(200);
    });

    it("returns route response", async () => {
      const response = await supertest(app).get(url);

      expect(response.body).toEqual(routeMock);
    });
  });

  describe("when route query params are invalid", () => {
    describe.each(["from", "to"])(
      'when "%s" query param is the only parameter',
      (param: string) => {
        const params = new URLSearchParams([
          [`${param}[]`, "8.681495"],
          [`${param}[]`, "49.41461"],
        ]);
        const url = `/route?${params.toString()}`;

        it("returns 400 [BAD_REQUEST] status", async () => {
          const response = await supertest(app).get(url);

          expect(response.status).toBe(400);
        });

        it("returns route error message response", async () => {
          const response = await supertest(app).get(url);

          expect(response.body).toEqual({
            message: [
              {
                code: "invalid_type",
                expected: "array",
                message: "Required",
                path: [param === "from" ? "to" : "from"],
                received: "undefined",
              },
            ],
          });
        });
      }
    );

    describe("when one of the query params have more than 2 elements", () => {
      const params = new URLSearchParams([
        ["from[]", "8.681495"],
        ["from[]", "49.41461"],
        ["from[]", "49.41461"],
        ["to[]", "8.687872"],
        ["to[]", "49.420318"],
      ]);

      const url = `/route?${params.toString()}`;

      it("returns 400 [BAD_REQUEST] status", async () => {
        const response = await supertest(app).get(url);

        expect(response.status).toBe(400);
      });

      it("returns route error message response", async () => {
        const response = await supertest(app).get(url);

        expect(response.body).toEqual({
          message: [
            {
              code: "too_big",
              exact: false,
              inclusive: true,
              maximum: 2,
              message: "Array must contain at most 2 element(s)",
              path: ["from"],
              type: "array",
            },
          ],
        });
      });
    });

    describe("when one of the query params have less than 2 elements", () => {
      const params = new URLSearchParams([
        ["from[]", "8.681495"],
        ["to[]", "8.687872"],
        ["to[]", "49.420318"],
      ]);

      const url = `/route?${params.toString()}`;

      it("returns 400 [BAD_REQUEST] status", async () => {
        const response = await supertest(app).get(url);

        expect(response.status).toBe(400);
      });

      it("returns route error message response", async () => {
        const response = await supertest(app).get(url);

        expect(response.body).toEqual({
          message: [
            {
              code: "too_small",
              exact: false,
              inclusive: true,
              message: "Array must contain at least 2 element(s)",
              minimum: 2,
              path: ["from"],
              type: "array",
            },
          ],
        });
      });
    });
  });

  describe("when calculateRoute service fails", () => {
    beforeEach(() => {
      jest.resetAllMocks();

      mockedCalculateRoute.mockImplementation(() => {
        return Promise.reject(new Error("Error"));
      });
    });

    const url = `/route?from[]=8.681495&from[]=49.41461&to[]=8.687872&to=49.420318`;

    it("returns 500 [INTERNAL_SERVER_ERROR] status", async () => {
      const response = await supertest(app).get(url);

      expect(response.status).toBe(500);
    });

    it("returns route error message response", async () => {
      const response = await supertest(app).get(url);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });
});
