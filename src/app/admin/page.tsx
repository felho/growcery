import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      AdminPage
      <div>
        <Link href="/admin/org-units">Org Units</Link> |
        <Link href="/admin/functions">Functions</Link> |
        <Link href="/admin/users">Users</Link>
      </div>
    </div>
  );
}
