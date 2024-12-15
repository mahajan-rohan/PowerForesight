import React from "react";
import DynamicInfoCard from "./DynamicInfoCard";
import { TextHoverEffect } from "./ui/text-hover-effect";
import HistoryChartComponent from "./Chart/HistoryChartComponent";
import ChartComponent from "./Chart/ChartComponent";

const HomeComponent = () => {
  return (
    <>
      <ChartComponent />
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <HistoryChartComponent />
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="relative flex flex-wrap justify-center items-center h-fit bg-transparent p-4">
        {/* <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <TextHoverEffect text="Power Forecast" duration={2} />
        </div> */}

        <DynamicInfoCard
          numericalValue={560}
          textValue="Current Bill Number"
          label="Bill Information"
          icon="receipt"
          unit="Rs"
        />
        <DynamicInfoCard
          numericalValue={5}
          textValue="Price per Kilowatt Hour"
          label="Energy Cost"
          icon="zap"
          unit="Rs"
        />
        {/* <DynamicInfoCard
          numericalValue={26}
          textValue="Price per Kilowatt Hour"
          label="Energy Cost"
          icon="dollar"
          unit="$"
        /> */}
        <DynamicInfoCard
          numericalValue={26}
          textValue="kmph"
          label="Wind speed"
          icon="wind"
          unit="kph"
        />
        <DynamicInfoCard
          numericalValue={47}
          textValue="Water density"
          label="Humidity"
          icon="humidity"
          unit="%"
        />
        <DynamicInfoCard
          numericalValue={25.4}
          textValue="Degree cen"
          label="Temperature"
          icon="temp"
          unit="'c"
        />
      </div>
    </>
  );
};

export default HomeComponent;
