interface Colors {
  primary: string;
  secondary: string;
  regularText: string;
  highlightText: string;
  white: string;
}
export interface Theme {
  colors: Colors;
  imgBrightness: number;
}
export const darkTheme: Theme = {
  colors: {
    primary: "#181a1b",
    secondary: "#393939",
    regularText: "#dcdde1",
    highlightText: "#ffffff",
    white: "#dcdde1"
  },
  //higher = less bright
  imgBrightness: 0.3
};
export const lightTheme: Theme = {
  colors: {
    primary: "#ffffff",
    secondary: "#dcdde1",
    regularText: "#393939",
    highlightText: "#181a1b",
    white: "#dcdde1"
  },
  //higher = less bright
  imgBrightness: 0
};
