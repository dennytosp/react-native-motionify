import Variables from './root.theme';

export type ThemeVariables = {
  Colors: typeof Variables.Colors;
  PrimaryColors: typeof Variables.PrimaryColors;
  FontSize: typeof Variables.FontSize;
  MetricsSizes: typeof Variables.MetricsSizes;
};

export type MetricVariables =
  | 'tiny'
  | 'small'
  | 'mediumSmall'
  | 'regular'
  | 'icon'
  | 'large'
  | 'big'
  | 'huge';

export type FontStringTypes =
  | 'black'
  | 'bold'
  | 'italic'
  | 'light'
  | 'medium'
  | 'regular';

export type FontSizeStringTypes = 'small' | 'regular' | 'large' | 'big';

export type FontProps = {
  fontType: FontStringTypes;
  fontSize: FontSizeStringTypes;
};
