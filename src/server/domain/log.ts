import { z } from "zod"

const LOG_LEVEL = ["fatal", "info", "warn", "error", "debug"] as const;
export type LogLevel = typeof LOG_LEVEL[number];
export const NO_BASE = "nothing";

export const logSchema = z.object({
  datetime: z.iso.datetime({local: true}),
  level: z.enum(LOG_LEVEL),
  title: z.string(),
  details: z.string(),
  patientId: z.string().optional(),
  userId: z.string().optional(),
});

export type Log = z.infer<typeof logSchema>;

/**
 * return base from path
 *
 * @param path - /login/base
 * @return base
 */
export function getBaseFromPath(path: string): string{
  const paths = path.split("/");
  if(paths.length >= 3){
    return paths[2];
  }
  return NO_BASE;
}