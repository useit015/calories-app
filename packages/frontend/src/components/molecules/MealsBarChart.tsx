import { FC, ReactNode, useContext, useMemo } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';
import { useElementSize } from '../../hooks/useElementSize';
import { AuthContext } from '../../store/AuthProvider';
import { formatCalories, formatDay } from '../../util/format';
import { ChartReferenceLineLabel, ChartTooltip } from '../atoms';

interface IMealBarChartProps {
  className?: string;
  children?: ReactNode;
  data: any[];
}

const MealBarChart: FC<IMealBarChartProps> = ({ className, data }) => {
  const { isAdmin, dailyLimit } = useContext(AuthContext);

  const [containerRef, { width }] = useElementSize();

  const hideAxisProps = useMemo(
    () => ({
      axisLine: false,
      tickLine: false,
    }),
    [],
  );

  return (
    <div className={className} ref={containerRef}>
      <BarChart
        data={data}
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
          tickCount={4}
          yAxisId="left"
          allowDecimals={false}
          tickFormatter={value => formatCalories(value, true)}
          {...hideAxisProps}
        />

        <XAxis
          dataKey="day"
          tickCount={7}
          tickFormatter={tick => formatDay(tick)}
          {...hideAxisProps}
        />

        <Tooltip
          content={<ChartTooltip isUser={!isAdmin} dailyLimit={dailyLimit} />}
        />

        {!isAdmin && (
          <ReferenceLine
            y={dailyLimit}
            yAxisId="left"
            stroke="#d32f2f"
            strokeDasharray="3 3"
            ifOverflow="extendDomain"
            label={({ offset, viewBox: { y } }) => (
              <ChartReferenceLineLabel
                width={width * 0.5}
                offset={offset}
                y={y}
              />
            )}
          />
        )}

        <Bar yAxisId="left" dataKey="calories" fill="#8884d8" />

        <Bar yAxisId="right" dataKey="meals" fill="#82ca9d" />

        {data[0]?.users !== null && (
          <>
            <Bar yAxisId="users" dataKey="users" fill="#FFA388" />

            <YAxis
              mirror
              tick={false}
              yAxisId="users"
              orientation="right"
              {...hideAxisProps}
            />
          </>
        )}

        <Legend layout="vertical" />
      </BarChart>
    </div>
  );
};

const StyledMealBarChart = styled(MealBarChart)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 5rem;
`;

export default StyledMealBarChart;
