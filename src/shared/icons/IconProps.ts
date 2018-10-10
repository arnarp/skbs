export type MainColors =
  | 'default'
  | 'white'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'green';
export type Sizes = 'small' | 'medium' | 'large' | 'xLarge';

export type IconProps = {
  color?: MainColors;
  size?: Sizes;
  className?: string;
};
