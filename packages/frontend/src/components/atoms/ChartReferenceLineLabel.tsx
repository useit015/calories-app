import { FC } from 'react';

interface IChartReferenceLineLabelProps {
  width: number;
  offset: number;
  y: number;
}

const ChartReferenceLineLabel: FC<IChartReferenceLineLabelProps> = ({
  offset,
  width,
  y,
}) => {
  return (
    <text
      y={y}
      x={width}
      offset={offset}
      textAnchor="middle"
      className="recharts-text recharts-label"
    >
      <tspan x={width} dy="-10">
        Daily limit
      </tspan>
    </text>
  );
};

export default ChartReferenceLineLabel;
