import React, { useState, useEffect, useRef, ChangeEvent, useCallback, useMemo } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

interface SelectedTime {
  hour: string;
  minute: string;
  second: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [showDropdowns, setShowDropdowns] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<SelectedTime>({ hour: "", minute: "", second: "" });
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Parse the value prop to get the hour, minute, and second
  useEffect(() => {
    const [hour, minute, second] = value.split(":");
    setSelectedTime({ hour, minute, second });
  }, [value]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const { hour = "", minute = "", second = "" } = selectedTime;
    if (hour === "" && minute === "" && second === "") {
      onChange("");
      setInputValue("");
    } else {
      const newTimeStr = `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
      onChange(newTimeStr);
      setInputValue(newTimeStr);
    }
  }, [selectedTime, onChange]);

  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setShowDropdowns(true);
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (timePickerRef.current && !timePickerRef.current.contains(e.relatedTarget as Node)) {
      setShowDropdowns(false);
    }
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Tab") {
      setShowDropdowns(false);
    }
  };

  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>, type: keyof SelectedTime) => {
    const selectedValue = e.target.value.padStart(2, "0"); // Ensure two-digit format
    setSelectedTime((prevTime) => {
      return { ...prevTime, [type]: selectedValue };
    });
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue); // Always update the inputValue

      const isValidTime = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(newValue);

      if (isValidTime) {
        onChange(newValue);
      } else if (newValue.length === 8) {
        // Only reset the dropdowns if the input is complete and invalid
        onChange("00:00:00");
      }
    },
    [onChange]
  );

  const handleClickOutside = (e: MouseEvent) => {
    if (timePickerRef.current && !timePickerRef.current.contains(e.target as Node)) {
      setShowDropdowns(false);
    }
  };

  // Function to generate an array of options
  const generateOptions = (start: number, end: number) => {
    const options: string[] = [];
    for (let i = start; i <= end; i++) {
      options.push(i.toString().padStart(2, "0"));
    }
    return options;
  };

  // Use useMemo for options generation
  const hourOptions = useMemo(() => generateOptions(0, 23), []);
  const minuteOptions = useMemo(() => generateOptions(0, 59), []);
  const secondOptions = useMemo(() => generateOptions(0, 59), []);

  return (
    <div ref={timePickerRef} className="time-picker-container">
      <input
        type="text"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      {showDropdowns && (
        <div className="time-picker-dropdown-container">
          <div>
            <label htmlFor="hours">Hours</label>
            <select
              id="hours"
              name="hours"
              value={selectedTime.hour}
              onKeyDown={handleInputKeyDown}
              onChange={(e) => handleDropdownChange(e, "hour")}
              tabIndex={-1}
            >
              {hourOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="minutes">Minutes</label>
            <select
              id="minutes"
              name="minutes"
              value={selectedTime.minute}
              onKeyDown={handleInputKeyDown}
              onChange={(e) => handleDropdownChange(e, "minute")}
              tabIndex={-1}
            >
              {minuteOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="seconds">Seconds</label>
            <select
              id="seconds"
              name="seconds"
              value={selectedTime.second}
              onKeyDown={handleInputKeyDown}
              onChange={(e) => handleDropdownChange(e, "second")}
              tabIndex={-1}
            >
              {secondOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
