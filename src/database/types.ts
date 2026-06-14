import * as z from "zod";
import { zAnyRecord } from "../record/types";
import { zBinaryTime } from "@seannyphoenix/binarytime";

export const zIndex = z.map(
  z.uuid(),
  z.strictObject({
    t: zBinaryTime,
    i: z.int().nonnegative(),
  }),
);

const zDatabase = z.strictObject({
  data: zAnyRecord.array(),
  index: zIndex,
});
export type Database = z.infer<typeof zDatabase>;
