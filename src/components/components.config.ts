import { ComponentsConfig } from './config-types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'My New Table', // Name of the component,
      component: 'MyTable',
      componentType: 'chart',
      chartType: 'table',
      settings: {
        label: {
          title: 'Label', // Label for the component
          defaultValue: 'my label', // Default value for the label
          ui: 'input', // UI for the label
        },
      },
    },
    {
      name: 'Month-over-Month Table',
      component: 'MonthOverMonthTable',
      componentType: 'chart',
      chartType: 'table',
      icon: 'Table2',
      settings: {
        title: {
          title: 'Title',
          defaultValue: 'Industry commodity index trends by region',
          ui: 'input',
        },
        subtitle: {
          title: 'Subtitle',
          defaultValue: 'Davis Insight weighted index changes by region for selected commodities',
          ui: 'input',
        },
      },
    },
    {
      name: 'Market Spreads',
      component: 'MarketSpreads',
      componentType: 'chart',
      chartType: 'table',
      icon: 'Grid3X3',
      settings: {
        title: {
          title: 'Title',
          defaultValue: 'Market spreads',
          ui: 'input',
        },
        subtitle: {
          title: 'Subtitle',
          defaultValue: 'Davis Insight regional spreads for #1 Busheling as of February 2025',
          ui: 'input',
        },
      },
    },
  ],
};
