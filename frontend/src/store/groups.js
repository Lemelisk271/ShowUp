import { csrfFetch } from "./csrf";

const FETCH_GROUPS = 'groups/fetchGroups'
const FETCH_SINGLE_GROUP = 'groups/fetchSingleGroup'

const getGroups = (groups) => {
  return {
    type: FETCH_GROUPS,
    groups
  }
}

const getSingleGroup = (group) => {
  return {
    type: FETCH_SINGLE_GROUP,
    group
  }
}

export const fetchGroups = () => async dispatch => {
  const res = await csrfFetch('/api/groups')
  const data = await res.json()
  dispatch(getGroups(data.Groups))
  return res
}

export const fetchSingleGroup = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/groups/${groupId}`)
  const data = await res.json()
  dispatch(getSingleGroup(data))
  return res
}

const initialState = {
  allGroups: null,
  singleGroup: null
}

const groupsReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case FETCH_GROUPS: {
      const groupList = [ ...action.groups ]
      const groupObj = {}
      groupList.forEach(group => {
        groupObj[group.id] = group
      })
      newState = { ...state }
      newState.allGroups = { ...groupObj }
      return newState
    }
    case FETCH_SINGLE_GROUP: {
      newState = { ...state }
      newState.singleGroup = { ...action.group }
      return newState
    }
    default:
      return state
  }
}

export default groupsReducer
