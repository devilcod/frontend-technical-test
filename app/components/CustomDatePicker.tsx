import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DateRange, PresetRange, PresetKey } from "../../types/types";

interface DateRangePickerProps {
  onRangeChange?: (range: DateRange) => void;
  initialRange?: DateRange;
  minDate?: Date;
  maxDate?: Date;
}

const CustomDatePicker: React.FC<DateRangePickerProps> = ({
  onRangeChange,
  initialRange,
  minDate,
  maxDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(
    initialRange ?? {
      start: null,
      end: null,
    }
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<PresetKey | "">("");

  // Preset ranges
  const presetRanges: PresetRange[] = [
    { label: "Today", key: "today" },
    { label: "Yesterday", key: "yesterday" },
    { label: "This week", key: "thisWeek" },
    { label: "Last week", key: "lastWeek" },
    { label: "This month", key: "thisMonth" },
    { label: "Last month", key: "lastMonth" },
    { label: "This year", key: "thisYear" },
    { label: "Last year", key: "lastYear" },
    { label: "All time", key: "allTime" },
  ];

  // Helper functions
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Handle preset selection
  const handlePresetClick = (preset: PresetKey): void => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case "today":
        // Start and end are already today
        break;
      case "yesterday":
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        break;
      case "thisWeek":
        start.setDate(start.getDate() - start.getDay());
        break;
      case "lastWeek":
        start.setDate(start.getDate() - start.getDay() - 7);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        break;
      case "thisMonth":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "thisYear":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case "lastYear":
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case "allTime":
        start = new Date(2020, 0, 1); // You can adjust this date
        break;
      default:
        return;
    }

    const newRange = { start, end };
    setSelectedDateRange(newRange);
    setActivePreset(preset);
    setCurrentDate(start);
    onRangeChange?.(newRange);
  };

  // Generate calendar data for a specific month
  const generateMonthData = (baseDate: Date): (Date | null)[] => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Navigate between months
  const navigateMonth = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Handle date selection
  const handleDateClick = (date: Date | null): void => {
    if (!date) return;

    if (isDateDisabled(date)) return;

    setActivePreset(""); // Clear preset selection when manually selecting dates

    let newRange: DateRange;
    if (!isSelecting || !selectedDateRange.start) {
      newRange = { start: date, end: null };
      setIsSelecting(true);
    } else {
      if (date < selectedDateRange.start) {
        newRange = { start: date, end: selectedDateRange.start };
      } else {
        newRange = { ...selectedDateRange, end: date };
      }
      setIsSelecting(false);
    }

    setSelectedDateRange(newRange);
    onRangeChange?.(newRange);
  };

  // Check if a date is within the selected range
  const isInRange = (date: Date | null): boolean => {
    if (!date || !selectedDateRange.start || !selectedDateRange.end) {
      return false;
    }
    return date >= selectedDateRange.start && date <= selectedDateRange.end;
  };

  // Check if a date is one of the endpoints of the range
  const isEndpoint = (date: Date | null): boolean => {
    if (!date || !selectedDateRange.start) {
      return false;
    }
    const isStartDate = date.getTime() === selectedDateRange.start.getTime();
    const isEndDate = selectedDateRange.end
      ? date.getTime() === selectedDateRange.end.getTime()
      : false;
    return isStartDate || isEndDate;
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }
    if (minDate && date < minDate) {
      return true;
    }
    if (maxDate && date > maxDate) {
      return true;
    }
    return false;
  };

  // Generate current and next month calendars
  const currentMonthDays = generateMonthData(currentDate);
  const nextMonth = new Date(currentDate);
  nextMonth.setMonth(currentDate.getMonth() + 1);
  const nextMonthDays = generateMonthData(nextMonth);

  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Render date cell with proper classes
  const getDateCellClass = (date: Date | null): string => {
    if (!date) return "invisible";

    const classes = ["p-2", "text-center", "text-sm"];

    if (isDateDisabled(date)) {
      classes.push("text-gray-300", "cursor-not-allowed");
    } else {
      classes.push("cursor-pointer");
      if (isEndpoint(date)) {
        classes.push("bg-blue-500", "text-white", "rounded-full");
      } else if (isInRange(date)) {
        classes.push("bg-blue-100");
      } else {
        classes.push("hover:bg-gray-100");
      }
    }

    return classes.join(" ");
  };

  const [open, setOpen] = useState(true);
  const handleOpen = () => {
    const value = open;
    setOpen(!value);
  };

  return (
    <>
      <button onClick={handleOpen}>Pilih Tanggal</button>
      <div
        className="bg-white text-black rounded-lg shadow-lg p-4 w-full max-w-5xl fixed top-1/4 left-1/4"
        style={{ display: `${open ? "none" : ""}` }}
      >
        <div className="flex gap-6">
          {/* Preset Range Options */}
          <div className="w-48 border-r pr-4">
            {presetRanges.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => handlePresetClick(key)}
                className={`
                w-full text-left px-3 py-2 rounded-md text-sm mb-1
                ${
                  activePreset === key
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }
              `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Calendar Section */}
          <div className="flex-1">
            {/* Date Range Display */}
            <div className="mb-4 text-sm text-gray-600">
              <span>
                Range: {formatDate(selectedDateRange.start)} -{" "}
                {formatDate(selectedDateRange.end)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center font-semibold">
                {currentDate.toLocaleString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex-1 text-center font-semibold">
                {nextMonth.toLocaleString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-8">
              {/* Current Month Calendar */}
              <div className="flex-1">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {currentMonthDays.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={getDateCellClass(date)}
                    >
                      {date?.getDate()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Month Calendar */}
              <div className="flex-1">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {nextMonthDays.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => handleDateClick(date)}
                      className={getDateCellClass(date)}
                    >
                      {date?.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  const newRange = { start: null, end: null };
                  setSelectedDateRange(newRange);
                  setActivePreset("");
                  onRangeChange?.(newRange);
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Applied:", selectedDateRange);
                  onRangeChange?.(selectedDateRange);
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomDatePicker;
