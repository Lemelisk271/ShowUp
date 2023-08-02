import { csrfFetch } from "./csrf";

const FETCH_EVENTS = 'events/fetchEvents'
const FETCH_SINGLE_EVENT = 'events/fetchSingleEvent'

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
    default:
      return state
  }
}

export default eventsReducer
