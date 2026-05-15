
import React from "react";
import Calendar from "react-calendar";
import { Button } from "react-bootstrap";
import dayjs from "dayjs";
import { DateRange } from "react-date-range";
import { useState } from "react";

import "../css/calendar_styles.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


export default function CalendarPanel({
  selectedDates,
  setSelectedDates,
  data
}) {
  const [showRangePicker, setShowRangePicker] = useState(false);

  const assessmentDates = Object.keys(data || {});

  const toggleDate = (date) => {
    const formatted = dayjs(date).format("YYYY-MM-DD");

    if (selectedDates.includes(formatted)) {
      setSelectedDates(selectedDates.filter(d => d !== formatted));
    } else {
      setSelectedDates([...selectedDates, formatted]);
    }
  };

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);


  return (
    <div className="p-3 border rounded calendar-container">
  
      {/* QUICK ACTIONS */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Button size="sm" onClick={() =>
          setSelectedDates([dayjs().format("YYYY-MM-DD")])
        }>
          Today
        </Button>

        <Button size="sm" onClick={() => {
          const lastWeek = [...Array(7)].map((_, i) =>
            dayjs().subtract(i, "day").format("YYYY-MM-DD")
          );
          setSelectedDates(lastWeek);
        }}>
          Last Week
        </Button>

        <Button size="sm" onClick={() => setShowRangePicker(!showRangePicker)}>
          Date Range
        </Button>


        <Button size="sm" className="clear-btn"  onClick={() => setSelectedDates([])}>
          Clear
        </Button>
      </div>

      {/* Range Picker Panel */}
      <div style={{ position: "relative" }}>

        {showRangePicker && (
          <div className="range-panel">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
            />

            <div className="d-flex justify-content-end gap-2 mt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowRangePicker(false)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  const start = dayjs(range[0].startDate);
                  const end = dayjs(range[0].endDate);

                  const dates = [];
                  let current = start;

                  while (current.isBefore(end) || current.isSame(end)) {
                    dates.push(current.format("YYYY-MM-DD"));
                    current = current.add(1, "day");
                  }

                  setSelectedDates(dates);
                  setShowRangePicker(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* CALENDAR */}
      <Calendar
        onClickDay={toggleDate}
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        view="month"
        maxDetail="month"
        minDetail="month"
        tileClassName={({ date }) => {
          const formatted = dayjs(date).format("YYYY-MM-DD");

          const hasAssessment = assessmentDates.includes(formatted);
          const isSelected = selectedDates.includes(formatted);

          if (isSelected) return "selected-day";
          if (hasAssessment) return "has-assessment";

          return null;
        }}

        
        tileContent={({ date }) => {
          const formatted = dayjs(date).format("YYYY-MM-DD");

          if (assessmentDates.includes(formatted)) {
            return <div className="calendar-dot" />;
          }

          return null;
        }}

        
       
      />
    </div>
  );
}
