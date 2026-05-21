import type { Job, JobType, PastOrder } from "../types";

/** Last delivered order for the same job type (faster repeat orders) */
export function lastOrderForJobType(
  pastOrders: PastOrder[],
  jobs: Job[],
  jobType: JobType
): PastOrder | null {
  const jobIdsForType = new Set(
    jobs.filter((j) => j.type === jobType).map((j) => j.id)
  );
  return pastOrders.find((o) => jobIdsForType.has(o.jobId)) ?? null;
}
