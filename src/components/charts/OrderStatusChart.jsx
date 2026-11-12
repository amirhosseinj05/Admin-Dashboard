import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { useTheme } from '../../context/ThemeContext.jsx';
import './chartSetup.js';

/**
 * Order status distribution (doughnut).
 * @param {{counts: {Completed:number, Pending:number, Cancelled:number}}} props
 */
export default function OrderStatusChart({ counts, height = 240 }) {
  const { isDark } = useTheme();

  const data = useMemo(
    () => ({
      labels: ['Completed', 'Pending', 'Cancelled'],
      datasets: [
        {
          data: [counts.Completed, counts.Pending, counts.Cancelled],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          hoverBackgroundColor: ['#0ea472', '#d97706', '#dc2626'],
          borderWidth: 0,
          spacing: 4,
        },
      ],
    }),
    [counts]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDark ? '#94a3b8' : '#64748b',
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            padding: 16,
            font: { size: 12, family: 'Inter' },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          padding: 12,
          cornerRadius: 10,
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'Inter', size: 12 },
        },
      },
    }),
    [isDark]
  );

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
