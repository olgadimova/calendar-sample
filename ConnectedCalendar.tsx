import React, { useEffect } from "react";
import { useAuthContext } from "../../lib/context/AuthContext";
import { useCalendarContext } from "../../lib/context/CalendarContext";
import { CEvent } from "../../lib/types/types";
import CalendarContainer from "../calendar/CalendarContainer";

export default function ConnectedCalendar() {
  const { user } = useAuthContext();
  const { addEvent, updateEvent, deleteEvent, fetchEvents } =
    useCalendarContext();

  useEffect(() => {
    fetchEvents(user?.id!);
  }, []);

  const handleAddEvent = (event: CEvent) => {
    addEvent(event, user?.id!);
  };

  const handleEditEvent = (event: CEvent) => {
    updateEvent({ id: event.id, ...event });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
  };

  return (
    <CalendarContainer
      handleAddEvent={(event) => handleAddEvent(event)}
      handleEditEvent={(event) => handleEditEvent(event)}
      handleDeleteEvent={(id) => handleDeleteEvent(id)}
    />
  );
}
