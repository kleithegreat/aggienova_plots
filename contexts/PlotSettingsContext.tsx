import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type XAxisType = "mjd" | "dsfo";
type YAxisType = "apparent" | "absolute";
type PlotType = "magnitude" | "color";
export type ColorOption = "U" | "V" | "B" | "UVW1" | "UVW2" | "UVM2";

interface PlotSettingsContextType {
  xAxisType: XAxisType;
  setXAxisType: React.Dispatch<React.SetStateAction<XAxisType>>;
  yAxisType: YAxisType;
  setYAxisType: React.Dispatch<React.SetStateAction<YAxisType>>;
  plotType: PlotType;
  setPlotType: React.Dispatch<React.SetStateAction<PlotType>>;
  firstColor: ColorOption;
  setFirstColor: React.Dispatch<React.SetStateAction<ColorOption>>;
  secondColor: ColorOption;
  setSecondColor: React.Dispatch<React.SetStateAction<ColorOption>>;
}

const PlotSettingsContext = createContext<PlotSettingsContextType | undefined>(undefined);

export const usePlotSettings = () => {
  const context = useContext(PlotSettingsContext);
  if (!context) {
    throw new Error("usePlotSettings must be used within a PlotSettingsProvider");
  }
  return context;
};

interface PlotSettingsProviderProps {
  children: ReactNode;
}

export const PlotSettingsProvider: React.FC<PlotSettingsProviderProps> = ({ children }) => {
  const [xAxisType, setXAxisType] = useState<XAxisType>("mjd");
  const [yAxisType, setYAxisType] = useState<YAxisType>("apparent");
  const [plotType, setPlotType] = useState<PlotType>("magnitude");
  const [firstColor, setFirstColor] = useState<ColorOption>("B");
  const [secondColor, setSecondColor] = useState<ColorOption>("B");

  return (
    <PlotSettingsContext.Provider
      value={{
        xAxisType,
        setXAxisType,
        yAxisType,
        setYAxisType,
        plotType,
        setPlotType,
        firstColor,
        setFirstColor,
        secondColor,
        setSecondColor,
      }}
    >
      {children}
    </PlotSettingsContext.Provider>
  );
};
