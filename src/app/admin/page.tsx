import { FolderTree } from "lucide-react";
import {
  Users as UsersIcon,
  Settings as SettingsIcon,
  FolderTree as FolderTreeIcon,
  PlusCircle as PlusCircleIcon,
  UserPlus as UserPlusIcon,
  FolderSymlink as FolderSymlinkIcon,
} from "lucide-react";
import { activities, functions, orgUnits, users } from "~/data/mockData";
import StatCard from "./_components/stat-card";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import QuickAction from "./_components/quick-action";

export default function AdminPage() {
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
          value={functions.length}
          icon={<SettingsIcon className="text-primary h-5 w-5" />}
          description="Total organization functions"
          route="/admin/functions"
        />
        <StatCard
          title="Org Units"
          value={orgUnits.length}
          icon={<FolderTreeIcon className="text-primary h-5 w-5" />}
          description="Total organization units"
          route="/admin/org-units"
        />
        <StatCard
          title="Users"
          value={users.length}
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
              route="/admin/functions/add"
            />
            <QuickAction
              icon={<FolderSymlinkIcon className="h-4 w-4" />}
              label="Create Org Unit"
              route="/admin/org-units/add"
            />
            <QuickAction
              icon={<UserPlusIcon className="h-4 w-4" />}
              label="Add User"
              route="/admin/users/add"
            />
          </div>
        </CardContent>
      </Card>

      <hr />
      <div>
        <Link href="/admin/org-units">Org Units</Link> |
        <Link href="/admin/functions">Functions</Link> |
        <Link href="/admin/users">Users</Link>
      </div>
    </div>
  );
}
