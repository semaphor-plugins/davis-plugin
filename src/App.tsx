import { MonthOverMonthTable } from './components/semaphor-components/month-over-month-table';
import { MarketSpreads } from './components/semaphor-components/market-spreads';
import { monthOverMonthData } from './data/mockMonthOverMonthData';
import { testOctoberFilterData, testNovemberFilterData } from './data/testMixedYearData';
import { testSeptemberOnlyData, testMultipleMonthsData } from './data/testSeptemberData';
import { marketSpreadsData } from './data/marketSpreadsData';
import { FilterValue } from './components/config-types';

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

  const filterValues: FilterValue[] = [
    {
      'filterId': '492ca81f-2a85-4fdd-99c7-633ada500da2',

      'name': 'sales_data.category',
      'valueType': 'string',
      'operation': 'in',
      'values': ['Technology'],
    },
    {
      'name': 'public.sales_data.order_date',
      'values': ['2015-11-01T05:00:00.000Z', '2016-11-30T06:00:00.000Z'],
      'filterId': '7de5700f-a50b-4c2f-b831-b84622ce22e9',
      'operation': 'between',
      'valueType': 'date',
    },
  ];

  console.log(filterValues);

  // Convert test data
  const octoberTestData = testOctoberFilterData.map((item) => {
    const converted: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(item)) {
      converted[key] = value === null ? '' : value;
    }
    return converted;
  });

  const novemberTestData = testNovemberFilterData.map((item) => {
    const converted: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(item)) {
      converted[key] = value === null ? '' : value;
    }
    return converted;
  });

  // Convert September test data
  const septemberOnlyData = testSeptemberOnlyData.map((item) => {
    const converted: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(item)) {
      converted[key] = value === null ? '' : value;
    }
    return converted;
  });

  const multipleMonthsData = testMultipleMonthsData.map((item) => {
    const converted: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(item)) {
      converted[key] = value === null ? '' : value;
    }
    return converted;
  });

  return (
    <div className="semaphor-custom">
      <div className="container mx-auto py-10 space-y-8">
        {/* Original Month-over-Month Table - All 2025 data */}
        <div className="w-full max-w-7xl mx-auto h-[500px] p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Month-over-Month Table - All 2025 Data (Original)
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

        {/* Test: October 2024 Filter Data */}
        <div className="w-full max-w-7xl mx-auto h-[500px] p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            TEST: October 2024 Filter (Oct 2024 → Nov 2023)
          </h2>
          <MonthOverMonthTable
            data={octoberTestData}
            settings={{
              title: 'October 2024 Filter Test',
              subtitle:
                'Should show: Oct 2024, Sep 2024, Aug 2024... back to Nov 2023',
            }}
          />
        </div>

        {/* Test: November 2024 Filter Data */}
        <div className="w-full max-w-7xl mx-auto h-[500px] p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            TEST: November 2024 Filter (Nov 2024 → Dec 2023)
          </h2>
          <MonthOverMonthTable
            data={novemberTestData}
            settings={{
              title: 'November 2024 Filter Test',
              subtitle:
                'Should show: Nov 2024, Oct 2024, Sep 2024... back to Dec 2023',
            }}
          />
        </div>

        {/* Test: September Only (debugging case) */}
        <div className="w-full max-w-7xl mx-auto h-[500px] p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            TEST: September Only Data (Debugging)
          </h2>
          <MonthOverMonthTable
            data={septemberOnlyData}
            settings={{
              title: 'September Only Test',
              subtitle:
                'Should show: Sep 2024 only (to verify single month detection)',
            }}
          />
        </div>

        {/* Test: Multiple Months (Sep 2024 → Oct 2023) */}
        <div className="w-full max-w-7xl mx-auto h-[500px] p-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            TEST: Multiple Months (Sep 2024 → Oct 2023)
          </h2>
          <MonthOverMonthTable
            data={multipleMonthsData}
            settings={{
              title: 'Multiple Months Test',
              subtitle:
                'Should show: Sep 2024, Aug 2024... back to Oct 2023 (12 months total)',
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
