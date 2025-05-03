import {
  Users as UsersIcon,
  Settings as SettingsIcon,
  FolderTree as FolderTreeIcon,
  PlusCircle as PlusCircleIcon,
  UserPlus as UserPlusIcon,
  FolderSymlink as FolderSymlinkIcon,
} from "lucide-react";
import { activities, functions, orgUnits, users } from "~/data/mock-data";
import StatCard from "./_components/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import QuickAction from "./_components/quick-action";
import ActivityItem from "./_components/activity-item";
import { getCurrentUserOrgId } from "~/lib/auth/get-org-id";
import { getDashboardStats } from "~/server/queries";

export default async function AdminPage() {
  const organizationId = await getCurrentUserOrgId();
  const stats = await getDashboardStats(organizationId);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your organization.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Functions"
          value={stats.functionCount}
          icon={<SettingsIcon className="text-primary h-5 w-5" />}
          description="Total organization functions"
          route="/admin/functions"
        />
        <StatCard
          title="Org Units"
          value={stats.orgUnitCount}
          icon={<FolderTreeIcon className="text-primary h-5 w-5" />}
          description="Total organization units"
          route="/admin/org-units"
        />
        <StatCard
          title="Users"
          value={stats.userCount}
          icon={<UsersIcon className="text-primary h-5 w-5" />}
          description="Total registered users"
          route="/admin/users"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common operations you might want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <QuickAction
              icon={<PlusCircleIcon className="h-4 w-4" />}
              label="Add Function"
              route="/admin/functions/form"
            />
            <QuickAction
              icon={<FolderSymlinkIcon className="h-4 w-4" />}
              label="Create Org Unit"
              route="/admin/org-units/form"
            />
            <QuickAction
              icon={<UserPlusIcon className="h-4 w-4" />}
              label="Add User"
              route="/admin/users/form"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions performed in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
