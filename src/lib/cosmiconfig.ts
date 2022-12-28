import { cosmiconfig } from "cosmiconfig";
import { z } from "zod";

const schema = z.object({
  patterns: z.array(z.string().transform((s) => new RegExp(s))),
});

export type Configuration = z.infer<typeof schema>;

export async function loadConfiguration(): Promise<Configuration | null> {
  const cc = cosmiconfig("align-package-versions");

  const config = await cc.search();
  if (!config?.config) {
    return null;
  }

  try {
    return schema.parse(config.config);
  } catch {
    return null;
  }
}
