import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartData[];
  totalAmount: number;
}

export function DonutChart({ data, totalAmount }: DonutChartProps) {
  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];

  return (
    <div className="relative h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-medium text-gray-400">Total</span>
        <span className="text-2xl font-bold tracking-tight text-gray-900">
          ¥{totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
