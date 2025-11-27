// Test data to verify September-only issue
// This simulates what the backend might be returning when user sees only September

export const testSeptemberOnlyData = [
  {
    'level1': 'North Central',
    'level2': null,
    'level3': null,
    'sep2024': 351.635,
    'sep2024_change': 0.21,
    'sep2024_volume': 86349,
    'ytd': 349.5,
    'ytd_change': 1.5,
    'ytd_volume': 850000,
    'yoy': 340.2,
    'yoy_change': 2.7,
    'yoy_volume': 820000,
  },
];

// Test data with multiple months to verify detection works correctly
export const testMultipleMonthsData = [
  {
    'level1': 'North Central',
    'level2': null,
    'level3': null,
    'sep2024': 351.635,
    'aug2024': 350.8925,
    'jul2024': 349.945,
    'jun2024': 349.3525,
    'may2024': 348.1825,
    'apr2024': 347.275,
    'mar2024': 346.845,
    'feb2024': 346.0075,
    'jan2024': 344.97,
    'dec2023': 343.50,
    'nov2023': 342.10,
    'oct2023': 341.00,

    'sep2024_change': 0.21,
    'aug2024_change': 0.27,
    'jul2024_change': 0.17,
    'jun2024_change': 0.3375,
    'may2024_change': 0.2625,
    'apr2024_change': 0.125,
    'mar2024_change': 0.2425,
    'feb2024_change': 0.3025,
    'jan2024_change': -3.36,
    'dec2023_change': -1.20,
    'nov2023_change': 0.50,
    'oct2023_change': 0.45,

    'sep2024_volume': 86349,
    'aug2024_volume': 86532,
    'jul2024_volume': 77345,
    'jun2024_volume': 86326,
    'may2024_volume': 82812,
    'apr2024_volume': 87979,
    'mar2024_volume': 84045,
    'feb2024_volume': 83813,
    'jan2024_volume': 92988,
    'dec2023_volume': 88000,
    'nov2023_volume': 85000,
    'oct2023_volume': 84000,

    'ytd': 349.5,
    'ytd_change': 1.5,
    'ytd_volume': 850000,
    'yoy': 340.2,
    'yoy_change': 2.7,
    'yoy_volume': 820000,
  },
];
