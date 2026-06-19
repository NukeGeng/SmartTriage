// page.tsx - Admin model transparency route composed from dashboard components.
import { AppShell } from "@/components/layout/AppShell";
import { ModelInfoDashboard } from "@/components/model/ModelInfoDashboard";

export default function ModelInfoPage() {
  return (
    <AppShell>
      <ModelInfoDashboard />
    </AppShell>
  );
}
