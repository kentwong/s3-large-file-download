import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TimePicker from "./TimePicker";

describe("TimePicker", () => {
  it("renders correctly", () => {
    const { getByRole } = render(<TimePicker value="00:00:00" onChange={jest.fn()} />);
    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange prop when input value changes", () => {
    const mockOnChange = jest.fn();
    const { getByRole } = render(<TimePicker value="00:00:00" onChange={mockOnChange} />);
    const input = getByRole("textbox");

    fireEvent.change(input, { target: { value: "01:00:00" } });

    expect(mockOnChange).toHaveBeenCalledWith("01:00:00");
  });

  it("displays dropdowns when input is focused", () => {
    const { getByRole, getByText } = render(<TimePicker value="00:00:00" onChange={jest.fn()} />);
    const input = getByRole("textbox");

    fireEvent.focus(input);

    expect(getByText("Hours")).toBeInTheDocument();
    expect(getByText("Minutes")).toBeInTheDocument();
    expect(getByText("Seconds")).toBeInTheDocument();
  });

  it("calls onChange prop when a dropdown value changes", () => {
    const mockOnChange = jest.fn();
    const { getByRole, getByLabelText } = render(<TimePicker value="00:00:00" onChange={mockOnChange} />);
    const input = getByRole("textbox");

    fireEvent.focus(input);

    const hoursDropdown = getByLabelText("Hours");
    fireEvent.change(hoursDropdown, { target: { value: "01" } });

    expect(mockOnChange).toHaveBeenCalledWith("01:00:00");
  });

  it("calls onChange prop when the minutes dropdown value changes", () => {
    const mockOnChange = jest.fn();
    const { getByRole, getByLabelText } = render(<TimePicker value="00:00:00" onChange={mockOnChange} />);
    const input = getByRole("textbox");

    fireEvent.focus(input);

    const minutesDropdown = getByLabelText("Minutes");
    fireEvent.change(minutesDropdown, { target: { value: "30" } });

    expect(mockOnChange).toHaveBeenCalledWith("00:30:00");
  });

  it("calls onChange prop when the seconds dropdown value changes", () => {
    const mockOnChange = jest.fn();
    const { getByRole, getByLabelText } = render(<TimePicker value="00:00:00" onChange={mockOnChange} />);
    const input = getByRole("textbox");

    fireEvent.focus(input);

    const secondsDropdown = getByLabelText("Seconds");
    fireEvent.change(secondsDropdown, { target: { value: "30" } });

    expect(mockOnChange).toHaveBeenCalledWith("00:00:30");
  });

  it("hides dropdowns when input loses focus", () => {
    const { getByRole, queryByText } = render(<TimePicker value="00:00:00" onChange={jest.fn()} />);
    const input = getByRole("textbox");

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(queryByText("Hours")).not.toBeInTheDocument();
    expect(queryByText("Minutes")).not.toBeInTheDocument();
    expect(queryByText("Seconds")).not.toBeInTheDocument();
  });

  it('calls onChange prop with "00:00:00" when input value changes to an invalid time', () => {
    const mockOnChange = jest.fn();
    const { getByRole } = render(<TimePicker value="00:00:00" onChange={mockOnChange} />);
    const input = getByRole("textbox");

    fireEvent.change(input, { target: { value: "invalid time" } });

    expect(mockOnChange).toHaveBeenCalledWith("00:00:00");
  });
});
