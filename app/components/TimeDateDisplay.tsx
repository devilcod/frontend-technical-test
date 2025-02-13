"use client";
import React, { useState, useEffect } from "react";

const TimeDateDisplay = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      second: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  if (currentTime === null) {
    return null;
  }

  return (
    <div className="time-date-display">
      <p>{formatDate(currentTime)}</p>
    </div>
  );
};

export default TimeDateDisplay;
