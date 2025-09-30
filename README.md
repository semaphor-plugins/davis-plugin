# Semaphor Plugin Quickstart

A starter template for creating custom components in Semaphor dashboard with React, TypeScript, and Vite.

## Overview

When embedding analytics into your app, you'll often need to display information in industry-specific ways. For example:

- **Trade analytics**: A specialized map to visualize imports and exports between countries.
- **Financial apps**: A table with precise sorting and filtering options.
- **HR tools**: A distribution chart to show candidate demographics.

The sheer variety of visualizations means no single charting library can cover every need. Most BI tools lock you into one or two libraries, offering only limited customization.

This creates a tough choice:

1. **Settle for generic charts**, leading to a subpar user experience.
2. **Build everything in-house**, investing time and resources in analytics infrastructure instead of your core product.

As your analytics needs evolve, rigid BI tools make it increasingly difficult to adapt. That's why flexibility is crucial when choosing an embedded analytics solution.

At **Semaphor**, we've designed a **pluggable architecture** that lets you bring your own charting library—or even fully custom components. This gives you complete control over the user experience, enabling you to integrate **interactive, custom visuals** with just a few lines of code.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Semaphor account and project

### Step 1: Clone and Setup

```bash
git clone https://github.com/rohitspujari/semaphor-plugin-quickstart.git
cd semaphor-plugin-quickstart
npm install
npm run dev
```

This starts a local development server at `http://localhost:5173`. You can open this repository in your favorite code editor and start exploring the code.

### Step 2: Explore the Custom Component

In the `src/components/semaphor-components/` folder, you'll find the custom component that we'll add to the Semaphor dashboard. It's a simple table component showing sales data — about 50 lines of code. It takes a `data` prop, which is the data to be displayed. But you can make your components as sophisticated as you want.

```tsx
// src/components/semaphor-components/my-table.tsx
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
```

### Step 3: Export Your Component

Once you are satisfied with your custom component, you need to export it as a named export in the `index.ts` file. You can export as many components as you want.

```tsx
// src/components/index.ts
import { MyTable } from './semaphor-components/my-table';

import '../index.css';

export { MyTable };
```

### Step 4: Configure Component Settings

Specify how this component should appear in Semaphor console with the `components.config.ts` file.

```tsx
// src/components/components.config.ts
import { ComponentsConfig } from './config-types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'My New Table', // The name of the component that will appear in the Semaphor dashboard
      component: 'MyTable', // The component exported in the index.ts file
      componentType: 'chart',
      chartType: 'table',
      settings: {
        label: {
          title: 'Label', // The label property of the component
          defaultValue: 'my label', // The default value of the label
          ui: 'input', // The UI type of the label property
        },
      },
    },
  ],
};
```

## 📦 Publishing to Semaphor

### Step 1: Install Semaphor CLI

To publish your component to Semaphor, you will first need to install `semaphor-cli`:

```bash
npm install -g semaphor-cli
```

### Step 2: Initialize Your Plugin

Initialize a new Semaphor `Plugin` for your custom component:

```bash
semaphor init
```

You will be prompted to enter:

- **Plugin type**: Choose `Plugin` (not App)
- **Plugin name**: Enter a unique name for your plugin
- **Build path**: Enter `dist` (default build output)
- **Semaphor Project ID**: Get this from your Semaphor project page
- **Semaphor Project Secret**: Get this from your Semaphor project page

**Note**: Make sure to initialize the `Plugin` and NOT the App.

### Step 3: Build and Publish

Build and publish your plugin to Semaphor:

```bash
npm run build
semaphor publish
```

Or use the combined command:

```bash
npm run publish
```

## 🎯 Using Your Custom Component

You can now use your custom component in the Semaphor dashboard just like any other visual from the visual selector and make it interactive with the rest of the dashboard.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run publish` - Build and publish to Semaphor
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/
│   ├── semaphor-components/
│   │   └── my-table.tsx          # Your custom component
│   ├── ui/                       # Reusable UI components
│   ├── index.ts                  # Component exports
│   ├── components.config.ts      # Component configuration
│   └── config-types.ts           # TypeScript types
├── lib/
│   └── utils.ts                  # Utility functions
└── main.tsx                      # Entry point
```

### Component Types

The project supports different types of components:

- **Single Input Visual**: Takes one dataset (`SingleInputVisualProps`)
- **Multi Input Visual**: Takes multiple datasets (`MultiInputVisualProps`)

### Chart Types

Supported chart types include:

- `line`, `bar`, `area`, `pie`, `donut`
- `radar`, `radial`, `funnel`, `range`
- `tornado`, `stacked`, `combo`, `table`

## 🎨 Styling

This project uses:

- **Tailwind CSS** for styling
- **Shadcn/ui** components for consistent design
- **Radix UI** for accessible primitives
- **Lucide React** for icons

## 📝 TypeScript Support

The project includes comprehensive TypeScript types for:

- Component props (`SingleInputVisualProps`, `MultiInputVisualProps`)
- Configuration (`ComponentsConfig`)
- Chart types and data structures

## 🤝 Support

If you have any questions or need help with your custom components, feel free to get in touch with us at support@semaphor.cloud

## 📚 Component Documentation

### Month-over-Month Table Component

#### Overview
A hierarchical table component for displaying commodity index trends with month-over-month, quarter, and year comparisons.

#### Data Structure

##### SQL Query Requirements
Your SQL query should return data with the following columns:

**Hierarchy Columns (Required)**
- `level1` - Top-level category (e.g., Region)
- `level2` - Second-level category (e.g., Sub-region) - null for top-level items
- `level3` - Third-level category (e.g., Mill) - null for level1 and level2 items

**Monthly Data Columns**
For each month (jan-dec), provide three columns:
- `{month}2025` - Value for the month (e.g., `jan2025: 355.45`)
- `{month}2025_change` - Percentage change (e.g., `jan2025_change: 1.50` for +1.50%)
- `{month}2025_volume` - Volume for the month (e.g., `jan2025_volume: 22000`)

**Quarterly Data Columns**
For each quarter (Q1-Q4):
- `q{n}_2025` - Quarter value (e.g., `q1_2025: 355.62`)
- `q{n}_2025_change` - Quarter percentage change
- `q{n}_2025_volume` - Quarter volume

**Annual Data Columns**
- `ytd` - Year-to-date value
- `ytd_change` - YTD percentage change
- `ytd_volume` - YTD volume
- `yoy` - Year-over-year value
- `yoy_change` - YoY percentage change
- `yoy_volume` - YoY volume

#### Sample SQL Query Structure

```sql
SELECT
  region AS level1,
  subregion AS level2,
  mill AS level3,

  -- January data
  jan_value AS jan2025,
  jan_change_pct AS jan2025_change,
  jan_volume AS jan2025_volume,

  -- February data
  feb_value AS feb2025,
  feb_change_pct AS feb2025_change,
  feb_volume AS feb2025_volume,

  -- ... repeat for all months ...

  -- Quarterly data
  q1_value AS q1_2025,
  q1_change_pct AS q1_2025_change,
  q1_volume AS q1_2025_volume,

  -- ... repeat for Q2-Q4 ...

  -- Annual data
  ytd_value AS ytd,
  ytd_change_pct AS ytd_change,
  ytd_volume AS ytd_volume,

  yoy_value AS yoy,
  yoy_change_pct AS yoy_change,
  yoy_volume AS yoy_volume

FROM commodity_metrics
ORDER BY level1, level2, level3
```

#### Sample Data Rows

```javascript
[
  // Region level (top-level)
  {
    level1: "North Central",
    level2: null,
    level3: null,
    jan2025: 350.30, jan2025_change: -1.10, jan2025_volume: 120000,
    feb2025: 352.10, feb2025_change: 0.51, feb2025_volume: 122000,
    // ... other months ...
    q1_2025: 350.77, q1_2025_change: -0.35, q1_2025_volume: 363000,
    ytd: 354.34, ytd_change: 1.59, ytd_volume: 1566500,
    yoy: 340.10, yoy_change: 4.18, yoy_volume: 1485000
  },

  // Sub-region level
  {
    level1: "North Central",
    level2: "Arizona",
    level3: null,
    jan2025: 352.80, jan2025_change: 1.20, jan2025_volume: 42000,
    // ... other data ...
  },

  // Mill level (lowest level)
  {
    level1: "North Central",
    level2: "Arizona",
    level3: "Mill 20",
    jan2025: 355.45, jan2025_change: 1.50, jan2025_volume: 22000,
    // ... other data ...
  }
]
```

#### Features

- **Hierarchical Display**: Three-level expandable/collapsible hierarchy
- **Month Selection**: Toggle individual months or view all months
- **Additional Columns**: Display quarters (Q1-Q4), YTD, or YoY data
- **Volume Toggle**: Show/hide volume data
- **Color Indicators**: Green for positive changes, red for negative changes
- **Responsive**: Months shown in descending chronological order

#### Notes

- Null values will be displayed as "—"
- Change percentages are displayed with + or - prefix
- Volume is formatted with K/M suffixes (e.g., 22K for 22,000)
- The table expects all date fields to use the '2025' suffix consistently

## 📄 License

This project is licensed under the MIT License.
