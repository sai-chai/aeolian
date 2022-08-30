import { useMemo, useId } from 'react';
import CircularProgress, {
   CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography, {
   TypographyProps,
} from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { keyframes, useTheme } from '@mui/material/styles';

import { AQIColors } from 'styles/themes';

type AQIColorsRef = `aqi.${AQIColors}.main`;

const aqiColorRanges: Record<AQIColors, number[]> = {
   good: [ 0, 50 ],
   moderate: [ 51, 100 ],
   sensitive: [ 101, 150 ],
   unhealthy: [ 151, 200 ],
   veryUnhealthy: [ 201, 300 ],
   hazardous: [ 301, 500 ],
};

const getAQIColor = (value: number): AQIColorsRef => {
   let key: keyof typeof aqiColorRanges;
   for (key in aqiColorRanges) {
      if (value >= aqiColorRanges[key][0] && value <= aqiColorRanges[key][1]) {
         return `aqi.${key}.main`;
      }
   }
};

const centeredBoxStyles = {
   top: 0,
   left: 0,
   bottom: 0,
   right: 0,
   position: 'absolute',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
};

interface AQIGaugeProps extends CircularProgressProps {
   /** Show alert styling */
   showAlert?: boolean;
   /**
    * Range of valid values of value prop.
    * @defaultValue `[0, 300]`
    */
   range?: [minimum: number, maximum: number];
   /**  Follows rules of color and bgcolor properties of SxProps */
   restColor?: string;
   /** Follows rules of color and bgcolor properties of SxProps */
   bgcolor?: string;
   size?: number;
   typographyProps?: TypographyProps<React.ElementType>;
}

const AQIGauge: React.FC<AQIGaugeProps> = ({
   value,
   range = [ 0, 300 ],
   showAlert,
   restColor,
   bgcolor,
   typographyProps,
   ...progressProps
}) => {
   const { palette: { error: errorColor } } = useTheme();
   const labelId = useId();
   const [ MIN, MAX ] = range;
   const { size, thickness } = progressProps;

   const flashAlert = useMemo(() => keyframes`
      0%, 100% {
         background-color: inherit;
         color: ${errorColor.main};
      }
      50% {
         background-color: ${errorColor.main};
         color: ${errorColor.contrastText};
      }
   `, [ errorColor ]);

   // 44 is the square dimension of the svg viewbox. Stroke-width is the
   // attribute set by thickness and it scales with viewbox size.
   const innerRadius = (size / 2) - (thickness * (size / 44));

   // Values higher than the maximum should be normalized to the maximum itself
   const normalizedValue = ((( value <= MAX ? value : MAX ) - MIN) * 100) 
      / (MAX - MIN);

   return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
         <Box sx={{ ...centeredBoxStyles }}>
            <CircularProgress
               role="presentation"
               variant="determinate"
               value={100}
               color="inherit"
               size={size}
               thickness={thickness}
               sx={{ color: restColor }}
            />
         </Box>
         <CircularProgress
            role="graphics-document"
            variant="determinate"
            value={normalizedValue}
            color="inherit"
            sx={{ color: getAQIColor(value) }}
            {...progressProps}
            aria-valuenow={value}
            aria-labelledby={labelId}
         />
         <Box 
            sx={{ 
               ...centeredBoxStyles, 
               width: '300px',
               height: '300px',
               clipPath: `circle(${innerRadius}px at center)`, 
               bgcolor,
               animation: showAlert 
                  ? `2s ease 0s infinite normal none running ${flashAlert}` 
                  : 'none',
            }}
         >
            <Typography
               id={labelId}
               variant="h4"
               component="div"
               align="center"
               {...typographyProps}
            >
               {value}<br/>AQI
            </Typography>
         </Box>
      </Box>
   );
}

export default AQIGauge;
