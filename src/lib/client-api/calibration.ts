import type { User, UserWithCalibrationData } from "~/server/queries/user";

/**
 * Fetch users who are assigned to a specific competency matrix and report to managers in a manager group
 */
export async function fetchCalibrationUsers(
  managerGroupId: number,
  matrixId: number
): Promise<UserWithCalibrationData[]> {
  const response = await fetch(`/api/calibration/users?managerGroupId=${managerGroupId}&matrixId=${matrixId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch calibration users");
  }
  return response.json();
}
