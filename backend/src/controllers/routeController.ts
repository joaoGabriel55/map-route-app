import type { Request, Response } from "express";
import { calculateRoute } from "../services/calculateRoute";
import { z } from "zod";

const routeSchema = z.object({
  from: z.tuple([z.string(), z.string()]),
  to: z.tuple([z.string(), z.string()]),
});

export const routeController = async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const result = routeSchema.safeParse({ from, to });

  if (!result.success) {
    res.status(400).json({ message: result.error.errors });
    return;
  }

  try {
    const route = await calculateRoute(result.data.from, result.data.to);

    res.status(200).send(route);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
