import { z } from "zod"

export type LogLevel = "fatal"|"info"|"warn"|"error"|"debug";

export const logSchema = z.object({
  datetime: z.iso.datetime({local: true}),
  level: z.enum(["fatal", "info", "warn", "error", "debug"]),
  title: z.string(),
  details: z.string(),
});

export type Log = z.infer<typeof logSchema>;