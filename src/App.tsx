import { MonthOverMonthTable } from './components/semaphor-components/month-over-month-table';
import { MarketSpreads } from './components/semaphor-components/market-spreads';
import { monthOverMonthData } from './data/mockMonthOverMonthData';
import { marketSpreadsData } from './data/marketSpreadsData';

export default function App() {
  // Using imported mock data with type conversion for nulls
  const tableData = monthOverMonthData.map((item) => {
    const converted: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(item)) {
      // Convert null to empty string for compatibility with the Data type
      converted[key] = value === null ? '' : value;
    }
    return converted;
  });

  return (
    <div className="semaphor-custom">
      <div className="container mx-auto py-10 space-y-8">
        {/* Month-over-Month Table */}
        <div className="w-full max-w-7xl mx-auto h-[500px] p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Month-over-Month Table Component
          </h2>
          <MonthOverMonthTable
            data={tableData}
            settings={{
              title: 'Industry commodity index trends by region',
              subtitle:
                'Davis Insight weighted index changes by region for selected commodities, from 2025, in USD/mt.',
            }}
          />
        </div>

        {/* Market Spreads Table */}
        <div className="w-full max-w-7xl mx-auto p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Market Spreads Component
          </h2>
          <MarketSpreads
            data={marketSpreadsData}
            settings={{
              title: 'Market spreads',
              subtitle:
                'Davis Insight regional spreads for #1 Busheling as of February 2025',
            }}
          />
        </div>
      </div>
    </div>
  );
}
