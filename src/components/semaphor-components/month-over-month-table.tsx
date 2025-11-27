import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Info,
  ImageIcon,
  MoreVertical,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SingleInputVisualProps } from '../config-types';

// Month name mapping for parsing and display
const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_DISPLAY: Record<string, string> = {
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
  may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
  sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
};

// Type for detected month columns
type MonthColumn = {
  month: string; // lowercase: jan, feb, etc.
  year: string; // e.g., "2024", "2025"
  display: string; // e.g., "Jan"
  fullKey: string; // e.g., "jan2024"
};

// Helper to detect month columns from data
const detectMonthColumns = (data: Record<string, string | number | boolean>[]): MonthColumn[] => {
  if (!data || data.length === 0) {
    console.log('⚠️ No data provided to detectMonthColumns');
    return [];
  }

  const firstRow = data[0];
  const monthColumns: MonthColumn[] = [];
  const seenKeys = new Set<string>();

  // Pattern: {month}{year} where month is jan-dec and year is 4 digits
  const monthPattern = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(\d{4})$/;

  console.log('🔑 All keys in first row:', Object.keys(firstRow));

  for (const key of Object.keys(firstRow)) {
    const match = key.match(monthPattern);
    if (match) {
      const [, month, year] = match;
      const fullKey = `${month}${year}`;

      // Only include this column if it has non-null data in at least one row
      const hasData = data.some(row => row[fullKey] !== null && row[fullKey] !== undefined && row[fullKey] !== '');

      console.log(`  📅 Found month column: ${fullKey}, hasData: ${hasData}`);

      if (!seenKeys.has(fullKey) && hasData) {
        seenKeys.add(fullKey);
        monthColumns.push({
          month,
          year,
          display: MONTH_DISPLAY[month],
          fullKey,
        });
      }
    }
  }

  console.log('📦 Month columns before sorting:', monthColumns);

  // Sort by year (descending) then by month (descending within year)
  monthColumns.sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year);
    if (yearDiff !== 0) return yearDiff;

    const aMonthIdx = MONTH_NAMES.indexOf(a.month);
    const bMonthIdx = MONTH_NAMES.indexOf(b.month);
    return bMonthIdx - aMonthIdx;
  });

  console.log('📦 Month columns after sorting:', monthColumns);

  // Only return the first 12 months (most recent 12 months)
  const result = monthColumns.slice(0, 12);
  console.log('✨ Final month columns (limited to 12):', result);
  return result;
};

const quarterMonths: Record<string, string[]> = {
  Q1: ['Mar', 'Feb', 'Jan'],
  Q2: ['Jun', 'May', 'Apr'],
  Q3: ['Sep', 'Aug', 'Jul'],
  Q4: ['Dec', 'Nov', 'Oct'],
};

export function MonthOverMonthTable({
  data,
  settings,
}: SingleInputVisualProps) {
  // Detect available month columns from data
  const detectedMonths = React.useMemo(() => {
    const detected = detectMonthColumns(data);
    console.log('🔍 Detected months:', detected);
    console.log('📊 Raw data sample (first row):', data[0]);
    return detected;
  }, [data]);

  // Create allMonths array from detected columns (for compatibility)
  const allMonths = React.useMemo(() => {
    const displayNames = detectedMonths.map(m => m.display);
    console.log('🎯 All months (display names):', displayNames);
    return displayNames;
  }, [detectedMonths]);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(['North Central'])
  );
  const [showVolume, setShowVolume] = useState(false);
  const [showMyMills, setShowMyMills] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Initialize selectedMonths with empty array (will be populated by useEffect)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  // Update selectedMonths when detected months change
  React.useEffect(() => {
    const newSelectedMonths = detectedMonths.slice(0, 4).map(m => m.display);
    console.log('✅ Setting selected months:', newSelectedMonths);
    setSelectedMonths(newSelectedMonths);
  }, [detectedMonths]);

  const [additionalColumn, setAdditionalColumn] = useState('YoY');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sort data hierarchically to ensure proper parent-child grouping
  const sortedData = React.useMemo(() => {
    const sorted: typeof data = [];

    // Helper function to sort items by the selected column
    const sortItems = (items: typeof data) => {
      if (!sortColumn) return items;

      return [...items].sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        // Handle null/undefined/empty values
        if (aValue === null || aValue === undefined || aValue === '')
          aValue = 0;
        if (bValue === null || bValue === undefined || bValue === '')
          bValue = 0;

        // Convert to numbers if possible for numeric comparison
        const aNum = Number(aValue);
        const bNum = Number(bValue);

        let comparison = 0;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          comparison = aNum - bNum;
        } else {
          // String comparison for non-numeric values
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    };

    // First, get and sort all top-level items (regions)
    const regions = data.filter(
      (item: Record<string, string | number | boolean>) =>
        !item.level2 && !item.level3
    );
    const sortedRegions = sortItems(regions);

    sortedRegions.forEach(
      (region: Record<string, string | number | boolean>) => {
        sorted.push(region);
        const regionKey = region.level1 ? String(region.level1) : '';

        // Then get and sort all subregions for this region
        const subregions = data.filter(
          (item: Record<string, string | number | boolean>) =>
            item.level1 === regionKey && item.level2 && !item.level3
        );
        const sortedSubregions = sortItems(subregions);

        sortedSubregions.forEach(
          (subregion: Record<string, string | number | boolean>) => {
            sorted.push(subregion);
            const subregionKey = subregion.level2
              ? String(subregion.level2)
              : '';

            // Then get and sort all mills for this subregion
            const mills = data.filter(
              (item: Record<string, string | number | boolean>) =>
                item.level1 === regionKey &&
                item.level2 === subregionKey &&
                item.level3
            );
            const sortedMills = sortItems(mills);

            sortedMills.forEach(
              (mill: Record<string, string | number | boolean>) => {
                sorted.push(mill);
              }
            );
          }
        );
      }
    );

    return sorted;
  }, [data, sortColumn, sortDirection]);

  if (!data || data?.length === 0) return null;

  const title = settings?.title || 'Industry commodity index trends by region';
  const subtitle =
    settings?.subtitle ||
    'Davis Insight weighted index changes by region for selected commodities, from 2025, in USD/mt.';

  const toggleExpanded = (rowKey: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowKey)) {
      newExpanded.delete(rowKey);
    } else {
      newExpanded.add(rowKey);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatChange = (change: number) => {
    const formatted = Math.abs(change).toFixed(2) + '%';
    return change >= 0 ? '+' + formatted : '-' + formatted;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  };

  const handleMonthToggle = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const handleAdditionalColumnChange = (value: string) => {
    if (value === 'All months') {
      setSelectedMonths([...allMonths]);
      setAdditionalColumn('');
    } else if (value.startsWith('Q')) {
      setSelectedMonths(quarterMonths[value] || []);
      setAdditionalColumn(value);
    } else {
      setAdditionalColumn(value);
    }
  };

  const getItemKey = (item: Record<string, string | number | boolean>) => {
    const level1 = item.level1 ? String(item.level1) : '';
    const level2 = item.level2 ? String(item.level2) : '';
    const level3 = item.level3 ? String(item.level3) : '';

    if (level3) {
      // Mill: unique key combining all three levels
      return `${level1}__${level2}__${level3}`;
    } else if (level2) {
      // Subregion: unique key combining region and subregion
      return `${level1}__${level2}`;
    }
    // Region: just the region name
    return level1;
  };

  const getDisplayName = (item: Record<string, string | number | boolean>) => {
    const level3 = item.level3 ? String(item.level3) : null;
    const level2 = item.level2 ? String(item.level2) : null;
    const level1 = item.level1 ? String(item.level1) : null;
    return level3 || level2 || level1 || '';
  };

  const getParentKey = (item: Record<string, string | number | boolean>) => {
    const level1 = item.level1 ? String(item.level1) : '';
    const level2 = item.level2 ? String(item.level2) : '';
    const level3 = item.level3 ? String(item.level3) : '';

    if (level3) {
      // Mill has subregion as parent: return the subregion's key
      return `${level1}__${level2}`;
    } else if (level2) {
      // Subregion has region as parent: return the region's key
      return level1;
    }
    // Region has no parent
    return null;
  };

  const getItemLevel = (item: Record<string, string | number | boolean>) => {
    if (item.level3) return 2; // Mill
    if (item.level2) return 1; // Subregion
    return 0; // Region
  };

  // Helper to get month column by display name
  const getMonthColumn = (displayName: string): MonthColumn | undefined => {
    return detectedMonths.find(m => m.display === displayName);
  };

  const renderRow = (
    item: Record<string, string | number | boolean>,
    index: number
  ) => {
    const itemKey = getItemKey(item);
    const displayName = getDisplayName(item);
    const parentKey = getParentKey(item);
    const level = getItemLevel(item);

    const hasChildren = sortedData.some(
      (d: Record<string, string | number | boolean>) => {
        const dParentKey = getParentKey(d);
        return dParentKey === itemKey;
      }
    );

    const isExpanded = expandedRows.has(itemKey);

    // Determine if row should be shown
    let shouldShow = false;
    if (level === 0) {
      // Always show top-level regions
      shouldShow = true;
    } else if (level === 1) {
      // Show subregions if their parent region is expanded
      shouldShow = parentKey ? expandedRows.has(parentKey) : false;
    } else if (level === 2) {
      // Show mills if their parent subregion is expanded
      // The parentKey for mills already points to the subregion's key
      shouldShow = parentKey ? expandedRows.has(parentKey) : false;
    }

    if (!shouldShow) return null;

    // Use the same monthsToShow logic as the main component
    // (defined outside this function in the component body)
    // We'll access it from the closure

    return (
      <tr
        key={index}
        className={`border-b border-border hover:bg-muted/50 ${
          level > 0 ? 'bg-muted/20' : ''
        }`}
      >
        <td className="px-4 py-3 text-left text-sm">
          <div
            className={`flex items-center ${
              level === 1 ? 'ml-6' : level === 2 ? 'ml-12' : ''
            }`}
          >
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(itemKey)}
                className="mr-2 p-1 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && level > 0 && (
              <span className="mr-2 p-1">
                <span className="text-muted-foreground">•</span>
              </span>
            )}
            {!hasChildren && level === 0 && (
              <span className="mr-2 p-1">
                <span className="text-muted-foreground">−</span>
              </span>
            )}
            <span
              className={`text-sm ${
                level === 0 ? 'font-semibold' : level === 1 ? 'font-medium' : ''
              }`}
            >
              {displayName}
            </span>
          </div>
        </td>

        {/* Render month columns */}
        {monthsToShow.map((monthDisplay) => {
          // Get the full month column info (with year)
          const monthCol = getMonthColumn(monthDisplay);
          if (!monthCol) return null;

          const monthKey = monthCol.fullKey; // e.g., "nov2024"
          const changeKey = monthKey + '_change';
          const volumeKey = monthKey + '_volume';

          return (
            <React.Fragment key={monthDisplay}>
              <td className="px-4 py-3 text-right font-mono text-sm">
                {item[monthKey] !== null && item[monthKey] !== undefined
                  ? Number(item[monthKey]).toFixed(2)
                  : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                {item[changeKey] !== null && item[changeKey] !== undefined ? (
                  <span
                    className={`text-sm font-medium ${getChangeColor(
                      Number(item[changeKey])
                    )}`}
                  >
                    {formatChange(Number(item[changeKey]))}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              {showVolume && (
                <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                  {item[volumeKey] !== null && item[volumeKey] !== undefined
                    ? formatVolume(Number(item[volumeKey]))
                    : '—'}
                </td>
              )}
            </React.Fragment>
          );
        })}

        {/* Render additional column (Quarter/YTD/YoY) */}
        {additionalColumn &&
          !['All months', 'Q1', 'Q2', 'Q3', 'Q4'].includes(
            additionalColumn
          ) && (
            <>
              {additionalColumn === 'YTD' && (
                <>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {item.ytd !== null && item.ytd !== undefined
                      ? Number(item.ytd).toFixed(2)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.ytd_change !== null &&
                    item.ytd_change !== undefined ? (
                      <span
                        className={`text-sm font-medium ${getChangeColor(
                          Number(item.ytd_change)
                        )}`}
                      >
                        {formatChange(Number(item.ytd_change))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  {showVolume && (
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                      {item.ytd_volume !== null && item.ytd_volume !== undefined
                        ? formatVolume(Number(item.ytd_volume))
                        : '—'}
                    </td>
                  )}
                </>
              )}
              {additionalColumn === 'YoY' && (
                <>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {item.yoy !== null && item.yoy !== undefined
                      ? Number(item.yoy).toFixed(2)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.yoy_change !== null &&
                    item.yoy_change !== undefined ? (
                      <span
                        className={`text-sm font-medium ${getChangeColor(
                          Number(item.yoy_change)
                        )}`}
                      >
                        {formatChange(Number(item.yoy_change))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  {showVolume && (
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                      {item.yoy_volume !== null && item.yoy_volume !== undefined
                        ? formatVolume(Number(item.yoy_volume))
                        : '—'}
                    </td>
                  )}
                </>
              )}
              {['Q1', 'Q2', 'Q3', 'Q4'].includes(additionalColumn) && (
                <>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {item[additionalColumn.toLowerCase() + '_2025'] !== null &&
                    item[additionalColumn.toLowerCase() + '_2025'] !== undefined
                      ? Number(
                          item[additionalColumn.toLowerCase() + '_2025']
                        ).toFixed(2)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item[additionalColumn.toLowerCase() + '_2025_change'] !==
                      null &&
                    item[additionalColumn.toLowerCase() + '_2025_change'] !==
                      undefined ? (
                      <span
                        className={`text-sm font-medium ${getChangeColor(
                          Number(
                            item[
                              additionalColumn.toLowerCase() + '_2025_change'
                            ]
                          )
                        )}`}
                      >
                        {formatChange(
                          Number(
                            item[
                              additionalColumn.toLowerCase() + '_2025_change'
                            ]
                          )
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  {showVolume && (
                    <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                      {item[additionalColumn.toLowerCase() + '_2025_volume'] !==
                        null &&
                      item[additionalColumn.toLowerCase() + '_2025_volume'] !==
                        undefined
                        ? formatVolume(
                            Number(
                              item[
                                additionalColumn.toLowerCase() + '_2025_volume'
                              ]
                            )
                          )
                        : '—'}
                    </td>
                  )}
                </>
              )}
            </>
          )}
      </tr>
    );
  };

  // Sort months to show in descending order (most recent first)
  const monthOrder = [
    'Dec',
    'Nov',
    'Oct',
    'Sep',
    'Aug',
    'Jul',
    'Jun',
    'May',
    'Apr',
    'Mar',
    'Feb',
    'Jan',
  ];

  // Use selectedMonths if populated, otherwise fall back to first 4 detected months
  const effectiveSelectedMonths = selectedMonths.length > 0
    ? selectedMonths
    : detectedMonths.slice(0, 4).map(m => m.display);

  const monthsToShow =
    additionalColumn === 'All months'
      ? allMonths
      : effectiveSelectedMonths.sort(
          (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
        );

  console.log('📋 Months to show in table:', monthsToShow);
  console.log('🔢 Selected months state:', selectedMonths);
  console.log('🔢 Effective selected months:', effectiveSelectedMonths);
  console.log('➕ Additional column:', additionalColumn);

  return (
    <div
      data-content="month-over-month-table"
      className="w-full h-full flex flex-col bg-background  border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtitle and Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-my-mills"
              checked={showMyMills}
              onCheckedChange={(checked) => setShowMyMills(checked as boolean)}
            />
            <Label
              htmlFor="show-my-mills"
              className="text-sm text-muted-foreground"
            >
              Show only my mills
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="show-volume"
              className="text-sm text-muted-foreground"
            >
              Show volume
            </Label>
            <Switch
              id="show-volume"
              checked={showVolume}
              onCheckedChange={setShowVolume}
            />
          </div>
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="pb-2 border-b">
                  <h3 className="text-sm font-medium text-muted-foreground text-center">
                    Customize table
                  </h3>
                </div>

                {allMonths.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Select Months</h4>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                      {allMonths.map((month) => (
                        <div key={month} className="flex items-center space-x-2">
                          <Checkbox
                            id={month}
                            checked={selectedMonths.includes(month)}
                            onCheckedChange={() => handleMonthToggle(month)}
                            disabled={
                              additionalColumn === 'All months' ||
                              ['Q1', 'Q2', 'Q3', 'Q4'].includes(additionalColumn)
                            }
                            className="h-4 w-4"
                          />
                          <Label
                            htmlFor={month}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {month}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-sm font-medium">Additional columns</h4>
                  <RadioGroup
                    value={additionalColumn}
                    onValueChange={handleAdditionalColumnChange}
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="YTD"
                          id="YTD"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="YTD"
                          className="text-sm font-normal cursor-pointer"
                        >
                          YTD
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Q1"
                          id="Q1"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="Q1"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Q1
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Q2"
                          id="Q2"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="Q2"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Q2
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Q3"
                          id="Q3"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="Q3"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Q3
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="Q4"
                          id="Q4"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="Q4"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Q4
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="All months"
                          id="AllMonths"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="AllMonths"
                          className="text-sm font-normal cursor-pointer whitespace-nowrap"
                        >
                          All months
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="YoY"
                          id="YoY"
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor="YoY"
                          className="text-sm font-normal cursor-pointer"
                        >
                          YoY
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1 basis-0 ">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('level1')}
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  Region / Sub Region / Mill
                  {sortColumn === 'level1' ? (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-30" />
                  )}
                </div>
              </th>
              {monthsToShow.map((monthDisplay) => {
                // Get the full month column info (with year)
                const monthCol = getMonthColumn(monthDisplay);
                if (!monthCol) return null;

                const monthKey = monthCol.fullKey; // e.g., "nov2024"
                const changeKey = monthKey + '_change';
                const volumeKey = monthKey + '_volume';

                return (
                  <React.Fragment key={monthDisplay}>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(monthKey)}
                    >
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        {monthCol.display} {monthCol.year}
                        {sortColumn === monthKey ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(changeKey)}
                    >
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        Chg
                        {sortColumn === changeKey ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    </th>
                    {showVolume && (
                      <th
                        className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort(volumeKey)}
                      >
                        <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                          Vol
                          {sortColumn === volumeKey ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-30" />
                          )}
                        </div>
                      </th>
                    )}
                  </React.Fragment>
                );
              })}
              {additionalColumn &&
                ['Q1', 'Q2', 'Q3', 'Q4'].includes(additionalColumn) && (
                  <>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        handleSort(additionalColumn.toLowerCase() + '_2025')
                      }
                    >
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        {additionalColumn}
                        {sortColumn ===
                        additionalColumn.toLowerCase() + '_2025' ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        handleSort(
                          additionalColumn.toLowerCase() + '_2025_change'
                        )
                      }
                    >
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        Chg
                        {sortColumn ===
                        additionalColumn.toLowerCase() + '_2025_change' ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    </th>
                    {showVolume && (
                      <th
                        className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          handleSort(
                            additionalColumn.toLowerCase() + '_2025_volume'
                          )
                        }
                      >
                        <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                          Vol
                          {sortColumn ===
                          additionalColumn.toLowerCase() + '_2025_volume' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-30" />
                          )}
                        </div>
                      </th>
                    )}
                  </>
                )}
              {additionalColumn &&
                !['All months', 'Q1', 'Q2', 'Q3', 'Q4'].includes(
                  additionalColumn
                ) && (
                  <>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(additionalColumn.toLowerCase())}
                    >
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        {additionalColumn}
                        {sortColumn === additionalColumn.toLowerCase() ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        handleSort(additionalColumn.toLowerCase() + '_change')
                      }
                    >
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        Chg
                        {sortColumn ===
                        additionalColumn.toLowerCase() + '_change' ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    </th>
                    {showVolume && (
                      <th
                        className="px-4 py-3 text-right text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          handleSort(additionalColumn.toLowerCase() + '_volume')
                        }
                      >
                        <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                          Vol
                          {sortColumn ===
                          additionalColumn.toLowerCase() + '_volume' ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-30" />
                          )}
                        </div>
                      </th>
                    )}
                  </>
                )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map(
              (
                item: Record<string, string | number | boolean>,
                index: number
              ) => renderRow(item, index)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
