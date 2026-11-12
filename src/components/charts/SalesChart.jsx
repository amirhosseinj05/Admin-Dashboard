import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import { useTheme } from '../../context/ThemeContext.jsx';
import { monthlyGrowth } from '../../data/mockData.js';
import './chartSetup.js';

const PRIMARY = '#4f46e5';
const SECONDARY = '#0ea5e9';

/**
 * Sales + new users growth (dual axis line chart).
 * @param {{height?: number, series?: {labels: string[], sales: number[], newUsers: number[]}}} props
 *   `series` switches between the ranges from `dailyGrowth` (defaults to 12 months).
 */
export default function SalesChart({ height = 300, series = monthlyGrowth }) {
  const { isDark } = useTheme();

  const data = useMemo(
    () => ({
      labels: series.labels,
      datasets: [
        {
          label: 'Sales ($)',
          data: series.sales,
          borderColor: PRIMARY,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return 'rgba(79, 70, 229, .15)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(79, 70, 229, .35)');
            gradient.addColorStop(1, 'rgba(79, 70, 229, .02)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: PRIMARY,
          yAxisID: 'y',
        },
        {
          label: 'New users',
          data: series.newUsers,
          borderColor: SECONDARY,
          backgroundColor: 'transparent',
          borderDash: [6, 6],
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: SECONDARY,
          yAxisID: 'y1',
        },
      ],
    }),
    [series]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: isDark ? '#94a3b8' : '#64748b',
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            padding: 18,
            font: { size: 12, family: 'Inter' },
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#0f172a',
          padding: 12,
          cornerRadius: 10,
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'Inter', size: 12 },
          displayColors: true,
          boxPadding: 4,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11, family: 'Inter' } },
        },
        y: {
          position: 'left',
          border: { display: false },
          grid: { color: isDark ? 'rgba(148, 163, 184, .12)' : 'rgba(100, 116, 139, .12)' },
          ticks: {
            color: isDark ? '#64748b' : '#94a3b8',
            font: { size: 11, family: 'Inter' },
            callback: (value) => `$${(value / 1000).toFixed(0)}k`,
          },
        },
        y1: {
          position: 'right',
          border: { display: false },
          grid: { drawOnChartArea: false },
          ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11, family: 'Inter' } },
        },
      },
    }),
    [isDark]
  );

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
