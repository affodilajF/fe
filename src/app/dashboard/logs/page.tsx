import data from "../data.json";
import { DataTable } from "@/components/data-table";

export default function LogsPage() {
  return (
    <div>
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground">
          Data individu yang tidak menggunakan APD
          (Alat Pelindung Diri).
        </p>
      </div>
      <div className="w-full overflow-hidden max-w-screen">
        <DataTable data={data} />
      </div>
    </div>
  );
}
