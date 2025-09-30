import { SingleInputVisualProps } from '../config-types';

export function MyTable({ data, settings }: SingleInputVisualProps) {
  if (!data || data?.length === 0) return null;

  // get the column keys of the data
  const keys = Object.keys(data[0]);

  // get the label from the settings
  const label = settings?.['label'] || 'My Sales Table';

  // calculate the total sales
  const totalSales = data.reduce(
    (acc, record) => acc + Number(record?.[keys[2]]),
    0
  );
  // format total sales to 2 decimal places and add $ with commas
  const formattedTotalSales = totalSales
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="px-4 bg-background rounded-lg">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        You made {formattedTotalSales} sales this month.
      </p>
      <ul className="p-0">
        {data.map((record, index) => (
          <li
            key={index}
            className=" flex items-center justify-between py-2 border-b border-muted last:border-none"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-black font-bold">
                {record[keys[0]]
                  ?.toString()
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="ml-3">
                <p className="font-medium text-foreground">
                  {record?.[keys[0]]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {record?.[keys[1]]}
                </p>
              </div>
            </div>
            <p className="font-semibold text-foreground">{record?.[keys[2]]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
