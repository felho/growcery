import OrgUnitFormLoader from "./org-unit-form-loader";

interface PageProps {
  searchParams: {
    orgUnitId?: string;
    parentName?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  return <OrgUnitFormLoader searchParams={searchParams} />;
}
