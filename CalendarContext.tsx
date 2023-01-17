import React, { createContext, useState, useContext } from "react";
import {
  addEventDB,
  updateEventDB,
  deleteEventDB,
  fetchEventsDB,
} from "../calendar_actions";
import { CEvent } from "../types/types";

interface State {
  events: { [id: string]: CEvent };
  addEvent: (event: CEvent, uid: string) => Promise<void>;
  updateEvent: (event: CEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  fetchEvents: (uid: string) => Promise<void>;
}

const initialState: State = {
  events: {},
  addEvent: async () => {},
  updateEvent: async () => {},
  deleteEvent: async () => {},
  fetchEvents: async () => {},
};

const CalendarContext = createContext<State>(initialState);

export const CalendarContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [events, setEvents] = useState<{ [id: string]: CEvent }>({});

  const addEvent = async (event: CEvent, uid: string) => {
    try {
      const eventId = await addEventDB(event, uid);
      setEvents((current) => ({
        ...current,
        [eventId!]: { ...event, id: eventId! },
      }));
    } catch (err) {
      throw Error("Sorry, error occured. Please, try again.");
    }
  };

  const updateEvent = async (event: CEvent) => {
    try {
      await updateEventDB(event);
      setEvents((current) => ({ ...current, [event.id!]: event }));
    } catch (err) {
      throw Error("Sorry, error occured. Please, try again.");
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteEventDB(id);
      setEvents((current) => {
        delete current[id];
        return { ...current };
      });
    } catch (err) {
      throw Error("Sorry, error occured. Please, try again.");
    }
  };

  const fetchEvents = async (uid: string) => {
    try {
      const querySnapshot = await fetchEventsDB(uid);
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        setEvents((current) => ({
          ...current,
          [doc.id]: {
            id: doc.id,
            start: new Date(data.start.toMillis()),
            end: new Date(data.end.toMillis()),
            title: data.title,
            lang: data.lang,
            langId: data.langId,
            duration: data.duration,
            owner: data.owner,
            createdAt: data.createdAt,
          },
        }));
      });
    } catch (err) {
      throw Error("Sorry, error occured. Please, try again.");
    }
  };

  const contextValues = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
  };

  return (
    <CalendarContext.Provider value={contextValues}>
      {children}
    </CalendarContext.Provider>
  );
};

export function useCalendarContext() {
  return useContext(CalendarContext);
}

export default CalendarContext;
