import { csrfFetch } from "./csrf";

const FETCH_EVENTS = 'events/fetchEvents'
const FETCH_SINGLE_EVENT = 'events/fetchSingleEvent'
const ADD_EVENT = 'events/addEvent'
const DELETE_EVENT = 'events/deleteEvent'
const EDIT_EVENT = 'events/editEvent'

const getEvents = (events) => {
  return {
    type: FETCH_EVENTS,
    events
  }
}

const getSingleEvent = (event) => {
  return {
    type: FETCH_SINGLE_EVENT,
    event
  }
}

const addEvent = (event) => {
  return {
    type: ADD_EVENT,
    event
  }
}

const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId
  }
}

const editEvent = (event) => {
  return {
    type: EDIT_EVENT,
    event
  }
}

export const fetchEvents = () => async dispatch => {
  const res = await csrfFetch('/api/events?size=1000')
  const data = await res.json()
  const eventObj = {}
  data.Events.forEach(event => {
    eventObj[event.id] = event
  })
  dispatch(getEvents(eventObj))
  return data
}

export const fetchSingleEvent = (eventId) => async dispatch => {
  const res = await csrfFetch(`/api/events/${eventId}`)
  const data = await res.json()
  dispatch(getSingleEvent(data))
  return data
}

export const addNewEvent = (event) => async dispatch => {
  const { venueId, name, type, capacity, price, description, startDate, endDate, url, groupId } = event

  const eventObj = {
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
  }

  const imgObj = {
    url,
    preview: true
  }

  const res = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(eventObj)
  })
  const eventRes = await res.json()
  if (res.ok) {
    await dispatch(addEvent(eventRes))
    await csrfFetch(`/api/events/${eventRes.id}/images`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(imgObj)
    })
  }
  return eventRes
}

export const removeEvent = (eventId) => async dispatch => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  })
  const data = await res.json()
  if (res.ok) {
    await dispatch(deleteEvent(eventId))
  }
  return data
}

export const updateEvent = (event) => async dispatch => {
  const { venueId, name, type, capacity, price, description, startDate, endDate, url, imageId, eventId } = event

  const eventObj = {
    venueId,
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate
  }

  const imageObj = {
    eventId,
    url,
    preview: true
  }

  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(eventObj)
  })
  const eventRes = await res.json()
  if (res.ok) {
    await dispatch(editEvent(eventRes))
    await csrfFetch(`/api/event-images/${imageId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(imageObj)
    })
  }
  return eventRes
}

const initialState = {
  allEvents: {},
  singleEvent: {}
}

const eventsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case FETCH_EVENTS: {
      newState = { ...state }
      newState.allEvents = { ...action.events }
      return newState
    }
    case FETCH_SINGLE_EVENT: {
      newState = { ...state }
      newState.singleEvent = action.event
      return newState
    }
    case ADD_EVENT: {
      newState = { ...state }
      newState.allEvents[action.event.id] = action.event
      return newState
    }
    case DELETE_EVENT: {
      newState = { ...state }
      delete newState.allEvents[action.eventId]
      newState.singleEvent = {}
      return newState
    }
    case EDIT_EVENT: {
      newState = { ...state }
      newState.allEvents[action.event.id] = action.event
      newState.singleEvent = action.event
      return newState
    }
    default:
      return state
  }
}

export default eventsReducer
