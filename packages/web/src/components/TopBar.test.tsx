import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("should render the project name", () => {
    render(<TopBar theme="light" onThemeToggle={() => {}} />);
    expect(screen.getByText("/dev/dash")).toBeInTheDocument();
  });

  it("should render the theme toggle button", () => {
    render(<TopBar theme="light" onThemeToggle={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call onThemeToggle when theme button is clicked", () => {
    const onThemeToggle = vi.fn();
    render(<TopBar theme="light" onThemeToggle={onThemeToggle} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onThemeToggle).toHaveBeenCalledTimes(1);
  });
});
