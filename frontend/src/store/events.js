import { csrfFetch } from "./csrf";

const FETCH_EVENTS = 'events/fetchEvents'

const getEvents = (events) => {
  return {
    type: FETCH_EVENTS,
    events
  }
}

export const fetchEvents = () => async dispatch => {
  const res = await csrfFetch('/api/events')
  const data = await res.json()
  dispatch(getEvents(data.Events))
  return res
}

const initialState = {
  allEvents: null,
  singleEvent: null
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
    default:
      return state
  }
}

export default eventsReducer
