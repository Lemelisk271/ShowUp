import { csrfFetch } from "./csrf";

const FETCH_EVENTS = 'events/fetchEvents'
const FETCH_SINGLE_EVENT = 'events/fetchSingleEvent'
const ADD_EVENT = 'events/addEvent'
const DELETE_EVENT = 'events/deleteEvent'

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

export const fetchEvents = () => async dispatch => {
  const res = await csrfFetch('/api/events')
  const data = await res.json()
  dispatch(getEvents(data.Events))
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

const initialState = {
  allEvents: {},
  singleEvent: {}
}

const eventsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case FETCH_EVENTS: {
      const eventList = [ ...action.events ]
      const eventObj = {}
      eventList.forEach(event => {
        eventObj[event.id] = event
      })
      newState = { ...state }
      newState.allEvents = { ...eventObj }
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
    default:
      return state
  }
}

export default eventsReducer
