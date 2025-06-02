import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { eq, inArray } from "drizzle-orm";
import { managerGroupMembers } from "~/server/db/schema/tables/manager-group-members";
import { users } from "~/server/db/schema/tables/users";
import { userCompMatrixAssignments } from "~/server/db/schema/tables/user_comp_matrix_assignments";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const managerGroupId = searchParams.get("managerGroupId");
  const matrixId = searchParams.get("matrixId");

  if (!managerGroupId || !matrixId) {
    return NextResponse.json(
      { error: "Manager group ID and matrix ID are required" },
      { status: 400 }
    );
  }

  try {
    const organizationId = await getCurrentUserOrgId();

    // 1. Get all managers from the manager group
    const managers = await db.query.managerGroupMembers.findMany({
      where: eq(managerGroupMembers.managerGroupId, parseInt(managerGroupId!, 10)),
      with: {
        user: true,
      },
    });

    const managerIds = managers.map((manager) => manager.userId);

    // 2. Get all users who report to these managers with their archetype and org unit
    const calibrationUsers = await db.query.users.findMany({
      where: (users, { and, eq, inArray }) => 
        and(
          eq(users.organizationId, organizationId),
          inArray(users.managerId, managerIds)
        ),
      with: {
        archetype: true,
        orgUnit: true,
      },
    });
    
    // 3. Get active matrix assignments for these users
    const activeAssignments = await db.query.userCompMatrixAssignments.findMany({
      where: (assignments, { and, eq, inArray }) =>
        and(
          eq(assignments.compMatrixId, parseInt(matrixId!, 10)),
          eq(assignments.isActive, true),
          inArray(
            assignments.revieweeId,
            calibrationUsers.map((user) => user.id)
          )
        ),
    });
    
    // 4. Get level assessments for users with active assignments
    const userIdsWithAssignments = new Set(
      activeAssignments.map((assignment) => assignment.revieweeId)
    );
    
    // Get user-matrix assignments for these users
    const userMatrixAssignments = await db.query.userCompMatrixAssignments.findMany({
      where: (assignments, { and, eq, inArray }) =>
        and(
          eq(assignments.compMatrixId, parseInt(matrixId!, 10)),
          eq(assignments.isActive, true),
          inArray(
            assignments.revieweeId,
            Array.from(userIdsWithAssignments)
          )
        ),
    });
    
    // Create a map of user ID to assignment ID
    const userToAssignmentMap = new Map(
      userMatrixAssignments.map(assignment => [
        assignment.revieweeId,
        assignment.id
      ])
    );
    
    // Get level assessments for these assignments
    const levelAssessments = await db.query.compMatrixLevelAssessments.findMany({
      where: (assessments, { and, eq, inArray }) =>
        and(
          eq(assessments.compMatrixId, parseInt(matrixId!, 10)),
          inArray(
            assessments.userCompMatrixAssignmentId,
            userMatrixAssignments.map(a => a.id)
          )
        ),
    });
    
    // Group level assessments by user ID using the assignment mapping
    const assessmentsByUser: Record<number, typeof levelAssessments> = {};
    
    // Initialize empty arrays for each user
    Array.from(userIdsWithAssignments).forEach(userId => {
      assessmentsByUser[userId] = [];
    });
    
    // Group assessments by user ID
    levelAssessments.forEach(assessment => {
      // Find which user this assessment belongs to
      const assignment = userMatrixAssignments.find(
        a => a.id === assessment.userCompMatrixAssignmentId
      );
      
      if (assignment) {
        const userId = assignment.revieweeId;
        if (!assessmentsByUser[userId]) {
          assessmentsByUser[userId] = [];
        }
        assessmentsByUser[userId].push(assessment);
      }
    });
    
    // Filter users and add their level assessments
    const usersWithActiveAssignments = calibrationUsers
      .filter((user) => userIdsWithAssignments.has(user.id))
      .map((user) => ({
        ...user,
        levelAssessments: assessmentsByUser[user.id] || [],
        activeCompMatrixAssignmentId: userToAssignmentMap.get(user.id) || 0,
      }));

    return NextResponse.json(usersWithActiveAssignments);
  } catch (error) {
    console.error("Error fetching calibration users:", error);
    return NextResponse.json(
      { error: "Failed to fetch calibration users" },
      { status: 500 }
    );
  }
}
