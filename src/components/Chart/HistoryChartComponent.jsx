"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import jsonData from "@/Data/jsonData";
import jsonPrediction from "@/Data/jsonPrediction";
import { MultiStepLoader as Loader } from "@/components/ui/multistep-loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@nextui-org/react";
import loadingStates from "@/Data/loadingStates";
import { DatePickerWithRange } from "../ui/DatePickerWithRange";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoryChartComponent = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "Monthly Consumption"
  );
  const [chartConfig, setChartConfig] = useState({
    labels: [],
    dataset: [],
  });

  const processFilteredData = (data, startDate, endDate) => {
    const filteredData = data.filter((item) => {
      const itemDate = moment(item.timestamp).format("YYYY-MM-DD");
      const isInDateRange =
        moment(itemDate).isSameOrAfter(
          moment(startDate).format("YYYY-MM-DD")
        ) &&
        moment(itemDate).isSameOrBefore(moment(endDate).format("YYYY-MM-DD"));

      return isInDateRange;
    });

    if (filteredData.length === 0) {
      alert("No data available for the selected date range");
      return { labels: [], dataset: [] };
    }

    if (selectedCategory === "Daily Consumption") {
      return processDailyData(filteredData);
    } else if (selectedCategory === "Weekly Consumption") {
      return processWeeklyData(filteredData);
    } else if (selectedCategory === "Monthly Consumption") {
      return processMonthlyData(filteredData);
    } else if (selectedCategory === "Prediction") {
      return processPrediction(filteredData);
    }

    return { labels: [], dataset: [] };
  };

  const processDailyData = (data) => {
    const hourlyConsumption = {};

    data.forEach((item) => {
      const hour = moment(item.timestamp).format("HH:00");
      hourlyConsumption[hour] =
        (hourlyConsumption[hour] || 0) + item.unitConsumption;
    });

    const sortedHours = Object.keys(hourlyConsumption).sort();
    const labels = sortedHours;
    const dataset = sortedHours.map((hour) =>
      parseFloat(hourlyConsumption[hour].toFixed(2))
    );

    return { labels, dataset };
  };

  const processWeeklyData = (data) => {
    const weeklyConsumption = {};

    data.forEach((item) => {
      const weekStart = moment(item.timestamp)
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
      weeklyConsumption[weekStart] =
        (weeklyConsumption[weekStart] || 0) + item.unitConsumption;
    });

    const sortedWeeks = Object.keys(weeklyConsumption).sort();
    const labels = sortedWeeks.map((_, index) => `Week ${index + 1}`);
    const dataset = sortedWeeks.map((week) =>
      parseFloat(weeklyConsumption[week].toFixed(2))
    );

    return { labels, dataset };
  };

  const processMonthlyData = (data) => {
    const monthlyConsumption = {};

    data.forEach((item) => {
      const monthStart = moment(item.timestamp)
        .startOf("month")
        .format("YYYY-MM");
      monthlyConsumption[monthStart] =
        (monthlyConsumption[monthStart] || 0) + item.unitConsumption;
    });

    const sortedMonths = Object.keys(monthlyConsumption).sort();
    const labels = sortedMonths.map((month) =>
      moment(month, "YYYY-MM").format("MMM YYYY")
    );
    const dataset = sortedMonths.map((month) =>
      parseFloat(monthlyConsumption[month].toFixed(2))
    );

    return { labels, dataset };
  };

  const processPrediction = (data) => {
    const dailyConsumption = {};

    data.forEach((item) => {
      const date = moment(item.timestamp).format("YYYY-MM-DD");
      dailyConsumption[date] =
        (dailyConsumption[date] || 0) + item.unitConsumption;
    });

    const sortedDates = Object.keys(dailyConsumption).sort();
    const labels = sortedDates.map((date) => moment(date).format("MMM DD"));
    const dataset = sortedDates.map((date) =>
      parseFloat(dailyConsumption[date].toFixed(2))
    );

    return { labels, dataset };
  };

  const handleFilterData = () => {
    const sourceData =
      selectedCategory === "Prediction" ? jsonPrediction : jsonData;

    if (selectedCategory === "Daily Consumption") {
      const processedData = processFilteredData(sourceData, fromDate, fromDate);
      setChartConfig(processedData);
    } else {
      const processedData = processFilteredData(sourceData, fromDate, toDate);
      setChartConfig(processedData);
    }
  };

  const chartData = {
    labels: chartConfig.labels,
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: chartConfig.dataset,
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex flex-wrap justify-evenly p-4">
        <div
          style={{ marginBottom: "20px" }}
          className="flex justify-content items-center gap-5 px-4 py-3 w-fit bg-gray-100 dark:bg-slate-800 rounded-full"
        >
          <div className={`px-4 py-2 rounded-full font-semibold`}>History</div>
          <button
            className={`${
              selectedCategory === "Daily Consumption"
                ? "bg-gray-300 dark:bg-slate-950"
                : "bg-gray-100"
            } px-4 py-2 border-l-[0.2rem] border-slate-400 rounded-full dark:bg-slate-800`}
            onClick={() => setSelectedCategory("Daily Consumption")}
          >
            Daily Consumption
          </button>
          <button
            className={`${
              selectedCategory === "Weekly Consumption"
                ? "bg-gray-300 dark:bg-slate-950"
                : "bg-gray-100"
            } px-4 py-2 border-l-[0.2rem] border-slate-400 rounded-full dark:bg-slate-800`}
            onClick={() => setSelectedCategory("Weekly Consumption")}
          >
            Weekly Consumption
          </button>
          <button
            className={`${
              selectedCategory === "Monthly Consumption"
                ? "bg-gray-300 dark:bg-slate-950"
                : "bg-gray-100"
            } px-4 py-2 border-l-[0.2rem] border-slate-400 rounded-full dark:bg-slate-800`}
            onClick={() => setSelectedCategory("Monthly Consumption")}
          >
            Monthly Consumption
          </button>
        </div>
        <div className="flex gap-0 h-fit items-center justify-center">
          <div className="flex flex-wrap gap-0 w-full ">
            {/* <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="yyyy-MM-dd"
              className="text-black dark:text-white bg-transparent px-4 py-3 border-2 border-b-0 border-gray-300 text-center"
            />
            {selectedCategory !== "Daily Consumption" && (
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="yyyy-MM-dd"
                className="text-black dark:text-white bg-transparent px-4 py-3 border-2 border-gray-300 text-center"
              />
            )} */}
            <DatePickerWithRange />
          </div>
          {/* <Button
            onClick={handleFilterData}
            className="bg-blue-500 rounded-r-xl px-4 py-3 text-white"
          >
            Filter
          </Button> */}

        </div>
      </div>
      <div className="h-1/3 w-1/2 mx-auto bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5 overflow-hidden relative">
        <Line
          data={chartData}
          options={{
            scales: {
              // y: {
              //   beginAtZero: true,
              // },
            },
          }}
        />
        <div className="w-full h-full overflow-hidden absolute top-0 z-20">
          <Loader
            loading={isLoading}
            loadingStates={loadingStates}
            duration={400}
            loop={false}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryChartComponent;
