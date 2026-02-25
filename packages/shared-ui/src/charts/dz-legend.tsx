import { CSSProperties, FC } from 'react';

interface IDzLegendProps {
  payload: any;
  placement?: 'bottom' | 'left';
}

export const DzLegend: FC<IDzLegendProps> = ({ payload, placement = 'bottom' }) => {
  const indicatorStyle: CSSProperties = {
    marginRight: '0.5rem',
    display: 'inline-block',
    height: '0.5rem',
    width: '0.375rem',
    borderRadius: '1px',
  };

  return (
    <ul className={`recharts-default-legend ${placement}`}>
      {payload.map((entry: any, index: number) => (
        <li className={`recharts-legend-item legend-item-${index}`} key={`item-${index}`}>
          <span style={{ ...indicatorStyle, backgroundColor: entry.color }} />
          <span className="recharts-legend-item-text">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};
