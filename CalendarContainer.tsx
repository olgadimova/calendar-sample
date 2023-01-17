import { useState } from "react";
import { CEvent, EventFormTypes } from "../../lib/types/types";
import BigCalendar from "./BigCalendar";
import EventFormModal from "./EventFormModal";
import EventDeleteModal from "./EventDeleteModal";
import EventListMobile from "./EventListMobile";

interface CalendarWrapperProps {
  onAdd: (data: Date) => void;
  onEdit: (data: CEvent) => void;
}

function CalendarWrapper({ onAdd, onEdit }: CalendarWrapperProps) {
  return (
    <div className="flex flex-col lg:flex-row">
      <BigCalendar onAdd={onAdd} onEdit={onEdit} />
      <EventListMobile onAdd={onAdd} onEdit={onEdit} />
    </div>
  );
}

interface CalendarContainerProps {
  handleAddEvent: (event: CEvent) => void;
  handleEditEvent: (event: CEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

export default function CalendarContainer(props: CalendarContainerProps) {
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [modalType, setModalType] = useState<EventFormTypes>(
    EventFormTypes.ADD_EVENT
  );
  const [modalData, setModalData] = useState<CEvent>({
    id: "0",
    start: new Date(),
    end: new Date(),
    title: "",
    duration: 1,
    lang: "",
    langId: "",
    owner: "",
    createdAt: new Date(),
  });

  const onAdd = (start: Date) => {
    setModalData({
      id: "0",
      start: start,
      end: start,
      title: "",
      duration: 1,
      lang: "",
      langId: "",
      owner: "",
      createdAt: new Date(),
    });
    setModalType(EventFormTypes.ADD_EVENT);
    setShowEventForm(true);
  };

  const onEdit = (event: CEvent) => {
    setModalData({
      id: event.id!,
      start: event.start!,
      end: event.start!,
      title: event.title,
      duration: event.duration,
      lang: event.lang,
      langId: event.langId,
      owner: event.owner,
      createdAt: event.createdAt,
    });
    setModalType(EventFormTypes.EDIT_EVENT);
    setShowEventForm(true);
  };

  const onDelete = () => {
    setShowEventForm(false);
    setShowDeleteForm(true);
  };

  const handleDelete = (id: string) => {
    setShowDeleteForm(false);
    props.handleDeleteEvent(id);
  };

  const handleCloseModal = (type: "event" | "delete") => {
    if (type === "event") setShowEventForm(false);
    else setShowDeleteForm(false);
  };

  return (
    <div className="w-full">
      <CalendarWrapper onAdd={onAdd} onEdit={onEdit} />

      {showEventForm && (
        <EventFormModal
          type={modalType}
          closeModal={() => handleCloseModal("event")}
          data={modalData}
          updateData={(data: CEvent) => {
            if (modalType == EventFormTypes.ADD_EVENT) {
              props.handleAddEvent(data);
            } else props.handleEditEvent(data);
            setShowEventForm(false);
          }}
          deleteData={() => onDelete()}
        />
      )}
      {showDeleteForm && (
        <EventDeleteModal
          id={modalData.id!}
          onDelete={(id) => handleDelete(id)}
          closeModal={() => handleCloseModal("delete")}
        />
      )}
    </div>
  );
}
