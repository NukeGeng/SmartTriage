// DashboardBarChart.tsx - Compact chart panel using the white gallery visual system.
type DashboardBarChartProps = {
  title: string;
  data: Array<{ label: string; count: number }>;
};

export function DashboardBarChart({ title, data }: DashboardBarChartProps) {
  const max = Math.max(...data.map((item) => item.count), 0);

  return (
    <section className="rounded-lg bg-card p-5 shadow-[0_14px_32px_rgba(23,23,37,0.08)]">
      <h2 className="font-display text-xl font-black text-ink">{title}</h2>
      {data.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">Chưa có dữ liệu.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {data.map((item, index) => {
            const width = max > 0 ? Math.max((item.count / max) * 100, 7) : 0;

            return (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-ink">
                    {item.label}
                  </span>
                  <span className="font-semibold text-neutral-500">
                    {item.count}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-pill bg-neutral-100">
                  <div
                    className="st-bar-grow h-full rounded-pill bg-ink"
                    style={{ width: `${width}%`, animationDelay: `${index * 110}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
