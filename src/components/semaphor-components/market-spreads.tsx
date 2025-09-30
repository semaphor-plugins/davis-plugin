import React from 'react';
import {
  Info,
  ArrowUp,
  ArrowDown,
  Maximize2,
  ImageIcon,
  Grid3X3,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { SingleInputVisualProps } from '../config-types';

const regionNames: Record<string, string> = {
  N: 'Total US',
  NC: 'North Central',
  NE: 'North East',
  NM: 'North Midwest',
  S: 'South',
  SE: 'South East',
};

export function MarketSpreads({ data, settings }: SingleInputVisualProps) {
  const [includeCompanyData, setIncludeCompanyData] = React.useState(false);

  if (!data || data.length === 0) return null;

  const title = settings?.title || 'Market spreads';
  const subtitle =
    settings?.subtitle ||
    'Davis Insight regional spreads for #1 Busheling as of February 2025';

  const regions = Array.from(
    new Set(data.map((d) => String(d.region_a)))
  ).sort();

  const getSpread = (regionA: string, regionB: string): number => {
    const item = data.find(
      (d) => String(d.region_a) === regionA && String(d.region_b) === regionB
    );
    return item?.spread ? Number(item.spread) : 0;
  };

  const getChange = (spread: number): number => {
    if (spread === 0) return 0;
    return spread > 0 ? Math.abs(spread) + 2 : -(Math.abs(spread) + 2);
  };

  const generateHeatmapData = () => {
    const heatmapData = [];
    for (let i = 0; i < regions.length; i++) {
      const row = [];
      for (let j = 0; j < regions.length; j++) {
        const spread = getSpread(regions[i], regions[j]);
        const intensity = Math.abs(spread) / 10;
        row.push(Math.min(intensity, 1));
      }
      heatmapData.push(row);
    }
    return heatmapData;
  };

  const heatmapData = generateHeatmapData();

  return (
    <div className="w-full bg-background border border-border ">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Lock className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">
              Include company data
            </label>
            <Checkbox
              checked={includeCompanyData}
              onCheckedChange={(checked) =>
                setIncludeCompanyData(checked as boolean)
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-4">
        <div className="flex-1">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-muted/50">
              <div className="p-3 border-r border-border">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-foreground whitespace-nowrap">
                    Region
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </div>
              {regions.map((region) => (
                <div
                  key={region}
                  className="p-3 border-r border-border last:border-r-0"
                >
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground whitespace-nowrap">
                      {regionNames[region] || region}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          Spread
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          Chg
                        </span>
                        <ChevronDown className="h-2 w-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {regions.map((rowRegion) => (
              <div
                key={rowRegion}
                className="grid grid-cols-7 border-t border-border"
              >
                <div className="p-3 border-r border-border bg-muted/30">
                  <span className="text-sm font-medium text-foreground">
                    {regionNames[rowRegion] || rowRegion}
                  </span>
                </div>
                {regions.map((colRegion) => {
                  const spread = getSpread(rowRegion, colRegion);
                  const change = getChange(spread);
                  const isZero = spread === 0;

                  return (
                    <div
                      key={colRegion}
                      className="p-3 border-r border-border last:border-r-0"
                    >
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="text-sm text-foreground">
                          {isZero ? '-' : Math.abs(spread).toFixed(2)}
                        </div>
                        <div
                          className={`text-sm ${
                            change > 0
                              ? 'text-green-600'
                              : change < 0
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {isZero
                            ? '-'
                            : change > 0
                            ? `+${change.toFixed(0)}`
                            : change.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="w-48">
          <div className="text-sm font-medium text-foreground mb-2">
            Spread Intensity
          </div>
          <div className="border border-border rounded-lg p-2 bg-muted/20">
            <div className="grid grid-cols-6 gap-1">
              {heatmapData.map((row, i) =>
                row.map((intensity, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor:
                        intensity === 0
                          ? '#f3f4f6'
                          : `rgba(0, 0, 0, ${0.2 + intensity * 0.6})`,
                    }}
                  />
                ))
              )}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Low</span>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
