import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import moment from "moment";
import { CalendarContextProvider } from "../../../lib/context/CalendarContext";
import ConnectedCalendar from "../../../components/connected/ConnectedCalendar";
import AuthContext from "../../../lib/context/AuthContext";
import { act } from "react-dom/test-utils";

describe("Connected Calendar", () => {
  it("Adds event to calendar after form submit with non-empty fields", async () => {
    const langs = [{ code: "US", label: "English", id: "1" }];
    act(() => {
      render(
        <AuthContext.Provider
          value={{
            user: { langs, id: "1" },
            getLangs: jest.fn(() => langs),
            loading: false,
            loggedIn: true,
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            updateUser: jest.fn(),
            getUid: jest.fn(() => "1"),
          }}
        >
          <CalendarContextProvider>
            <ConnectedCalendar />
          </CalendarContextProvider>
        </AuthContext.Provider>
      );
    });
    let today = moment().toDate();
    let day = today.getDate();
    let dayStr = screen.getByText(day < 10 ? "0" + day : day.toString());
    fireEvent.click(dayStr);

    expect(screen.getByTestId("event-form-modal")).toBeInTheDocument();
    expect(screen.getByText("Add Event")).toBeInTheDocument();
    expect(screen.getByText(/Choose Language/)).toBeInTheDocument();
    expect(screen.getByText(/Date: /)).toHaveTextContent(
      "Date: " + moment(today).format("ll")
    );

    fireEvent.change(screen.getByPlaceholderText("Activity"), {
      target: { value: "Hello Event" },
    });

    fireEvent.click(screen.getByTestId("event-form-language-btn"));
    expect(screen.getByText(/English/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/English/));

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
    });

    expect(screen.queryByTestId("event-form-modal")).toBeNull();
    expect(screen.getAllByText(/Hello Event/)).toHaveLength(2);
  });

  it("Updates event info & calendar title text after form submit with non-empty fields", async () => {
    const langs = [{ code: "US", label: "English", id: "1" }];
    act(() => {
      render(
        <AuthContext.Provider
          value={{
            user: { langs, id: "1" },
            getLangs: jest.fn(() => {
              return langs;
            }),
            loading: false,
            loggedIn: true,
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            updateUser: jest.fn(),
            getUid: jest.fn(() => "1"),
          }}
        >
          <CalendarContextProvider>
            <ConnectedCalendar />
          </CalendarContextProvider>
        </AuthContext.Provider>
      );
    });

    let today = moment().toDate();
    let day = today.getDate();
    fireEvent.click(screen.getAllByText(day < 10 ? "0" + day : day)[0]);

    expect(screen.getByTestId("event-form-modal")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Activity"), {
      target: { value: "Hello Event" },
    });

    fireEvent.click(screen.getByTestId("event-form-language-btn"));
    expect(screen.getByText(/English/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/English/));

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
    });

    expect(screen.queryByTestId("event-form-modal")).toBeNull();
    expect(screen.getAllByText(/Hello Event/)).toHaveLength(2);

    fireEvent.click(
      screen.getByTestId("full-calendar").getElementsByClassName("rbc-event")[0]
    );

    expect(screen.queryByTestId("event-form-modal")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Activity/)).toHaveValue("Hello Event");
    fireEvent.change(screen.getByPlaceholderText(/Activity/), {
      target: { value: "Event 1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Minutes Spent/), {
      target: { value: 10 },
    });

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Save/ }));
    });

    expect(screen.queryByTestId("event-modal-form")).toBeNull();
    expect(screen.getAllByText("Event 1")).toHaveLength(2);
  });

  it("Removes Event title and info from Calendar after delete form is submitted", async () => {
    const langs = [{ code: "US", label: "English", id: "1" }];
    act(() => {
      render(
        <AuthContext.Provider
          value={{
            user: { langs, id: "1" },
            getLangs: jest.fn(() => {
              return langs;
            }),
            loading: false,
            loggedIn: true,
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            updateUser: jest.fn(),
            getUid: jest.fn(() => "1"),
          }}
        >
          <CalendarContextProvider>
            <ConnectedCalendar />
          </CalendarContextProvider>
        </AuthContext.Provider>
      );
    });
    let today = moment().toDate();
    let day = today.getDate();
    fireEvent.click(screen.getByText(day < 10 ? "0" + day : day.toString()));

    // adding event
    fireEvent.change(screen.getByPlaceholderText("Activity"), {
      target: { value: "Hello Event" },
    });

    fireEvent.click(screen.getByTestId("event-form-language-btn"));
    expect(screen.getByText(/English/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/English/));

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
    });
    // selecting event
    fireEvent.click(
      screen.getByTestId("full-calendar").getElementsByClassName("rbc-event")[0]
    );
    expect(screen.queryByTestId("event-form-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.queryByTestId("event-modal-form")).toBeNull();

    // Submitting delete modal
    expect(screen.getByTestId("event-delete-modal")).toBeInTheDocument();
    await act(() => {
      fireEvent.click(screen.getByText(/OK/));
    });

    expect(screen.queryByTestId("event-delete-modal")).toBeNull();
    expect(screen.queryByText(/Hello Event/)).toBeNull();
  });
});
