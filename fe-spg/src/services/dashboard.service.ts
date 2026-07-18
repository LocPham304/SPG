import { apiRequest } from "@/lib/api";
import type { DashboardSummary } from "@/types/dashboard";

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>("/admin/dashboard/summary");
}
