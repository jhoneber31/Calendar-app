import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onEditEvent, onLoadEvents, onSetActiveEvent } from "../store";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

  const dispatch = useDispatch();

  const {events,activeEvent} = useSelector(state => state.calendar);
  const {user} = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async(calendarEvent) => {

    try {
      //TODO: llegar al backend
      if(calendarEvent.id) {
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onEditEvent({...calendarEvent, user}));
        return;
      } 

      const {data} = await calendarApi.post('/events', calendarEvent);
      dispatch(onAddNewEvent({...calendarEvent, id: data.evento.id, user}))

    } catch (error) {
      console.log(error)
      Swal.fire('Error', error.response.data?.msg, 'error');
    }

  }

  const startDeletingEvent = async() => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar', error.response.data?.msg, 'error');
    }
  }

  const startLoadingEvents = async() => {
    try {
      const {data} = await calendarApi.get('/events');
      const events = convertEventsToDateEvents(data.event);
      dispatch(onLoadEvents(events))
    } catch (error) {
      console.log("Error al cargar los eventos", error);
    }
  }

  return {
    //*Propiedades
    activeEvent,
    events,
    hasEventSelected : !!activeEvent,
    //*Metodos
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents
  }
}
