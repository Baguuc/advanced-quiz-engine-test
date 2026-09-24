import { os } from "@orpc/server";
import * as z from "zod";

export const listPlanets = os.handler(() => {
  return [
    { id: 1, name: "Earth" },
    { id: 2, name: "Mars" },
  ];
});

export const findPlanet = os.input(z.object({ id: z.number() })).handler(({ input }) => {
  return { id: input.id, name: "Earth" };
});

export const createPlanet = os
  .input(z.object({ name: z.string(), description: z.string().optional() }))
  .handler(({ input }) => {
    return { id: 3, ...input };
  });

export const router = {
  planet: {
    list: listPlanets,
    find: findPlanet,
    create: createPlanet,
  },
};
