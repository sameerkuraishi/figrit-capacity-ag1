import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema";

export function getDb() {
  const workerEnv = env as unknown as { DB?: D1Database };
  const db = workerEnv.DB;
  if (!db) {
    throw new Error("D1 Database not bound to env.DB");
  }

  return drizzle(db, { schema });
}
