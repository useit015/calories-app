import { FC, ReactNode, useMemo } from 'react';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { useElementSize } from '../../hooks/useElementSize';
import { IStatItem } from '../../hooks/useUserMeals';
import { formatCalories } from '../../util/format';
import { ChartTooltip } from '../atoms';

interface IWeeklyUserStatsBarChartProps {
  className?: string;
  children?: ReactNode;
  stats?: IStatItem[];
}

const WeeklyUserStatsBarChart: FC<IWeeklyUserStatsBarChartProps> = ({
  className,
  stats,
}) => {
  const [containerRef, { width }] = useElementSize();

  const users = useMemo(
    () =>
      Object.entries(stats?.[0]?.users ?? {}).map(
        ([user, { calories, meals }]) => ({
          calories: +calories.toFixed(2),
          meals,
          user,
        }),
      ),
    [stats],
  );

  const hideAxisProps = useMemo(
    () => ({
      axisLine: false,
      tickLine: false,
    }),
    [],
  );

  if (!users.length) {
    return null;
  }

  return (
    <div className={className} ref={containerRef}>
      <BarChart
        data={users}
        width={width}
        height={Math.max(250, width * 0.42)}
        margin={{
          top: 25,
        }}
      >
        <YAxis
          mirror
          tick={false}
          yAxisId="right"
          orientation="right"
          {...hideAxisProps}
        />

        <YAxis
          yAxisId="left"
          allowDecimals={false}
          tickFormatter={value => formatCalories(value, true)}
          {...hideAxisProps}
        />

        <XAxis dataKey="user" type="category" {...hideAxisProps} />

        <Tooltip content={<ChartTooltip isUser={false} isUserChart />} />

        <Bar yAxisId="left" dataKey="calories" fill="#8884d8" />

        <Bar yAxisId="right" dataKey="meals" fill="#82ca9d" />

        <Legend layout="vertical" />
      </BarChart>
    </div>
  );
};

const StyledWeeklyUserStatsBarChart = styled(WeeklyUserStatsBarChart)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 5rem;
`;

export default StyledWeeklyUserStatsBarChart;
