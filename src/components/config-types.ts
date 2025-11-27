// Types
export type ChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'radial'
  | 'funnel'
  | 'range'
  | 'tornado'
  | 'stacked'
  | 'combo'
  | 'table';

export type Data = Record<string, string | number | boolean>[];

export type DataArray = Data[];

export type CustomCardTheme = {
  colors?: string[];
  mode?: 'light' | 'dark' | 'system';
};

export type Operation =
  | '='
  | '>'
  | '<'
  | '>='
  | '<='
  | '!='
  | 'in'
  | 'not in'
  | 'like'
  | 'not like'
  | 'between'
  | 'not between'
  | 'is null'
  | 'is not null';

export type FilterValue = {
  filterId: string;
  name: string;
  valueType: 'string' | 'number' | 'date' | 'boolean';
  operation: Operation;
  values: (string | number | boolean)[];
};

export type SingleInputVisualProps = {
  data: Data;
  settings?: Record<string, string | number | boolean>;
  theme?: CustomCardTheme;
  filterValues?: FilterValue[];
};

export type MultiInputVisualProps = {
  data: DataArray;
  settings?: Record<string, string | number | boolean>[];
};

export type ComponentsConfig = {
  visuals: {
    name: string; // display name as it appead in the dropdown. Must be unique.
    chartType?: ChartType; // this must be unique. The chart settings component if present will need this info to render the correct chart settings.
    component: string;
    componentType: 'chart';
    icon?: string; // name of the icon (React Component) from lucide
    dataInputs?: string[];
    settings?: {
      [key: string]: {
        title: string;
        defaultValue: string;
        ui: 'input' | 'select';
        options?: {
          label: string;
          value: string;
        }[];
      };
    };
  }[];
};
