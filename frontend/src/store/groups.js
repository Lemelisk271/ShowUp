import { csrfFetch } from "./csrf";

const FETCH_GROUPS = 'groups/fetchGroups'
const FETCH_SINGLE_GROUP = 'groups/fetchSingleGroup'
const ADD_GROUP = 'groups/addGroup'
const EDIT_GROUP = 'groups/editGroup'
const DELETE_GROUP = 'groups/delete'

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

const addGroup = (group) => {
  return {
    type: ADD_GROUP,
    group
  }
}

const editGroup = (group) => {
  return {
    type: EDIT_GROUP,
    group
  }
}

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
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

export const addNewGroup = (group) => async dispatch => {
  const { name, about, type, privateState, city, state, url } = group

  const groupObj = {
    name,
    about,
    type,
    private: privateState,
    city,
    state
  }

  const imageObj = {
    url,
    preview: true
  }

  const res = await csrfFetch('/api/groups', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(groupObj)
  })
  const groupRes = await res.json()
  if (res.ok) {
    await dispatch(addGroup(groupRes))
    await csrfFetch(`/api/groups/${groupRes.id}/images`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(imageObj)
    })
  }
  return groupRes
}

export const updateGroup = (group) => async dispatch => {
  const { name, about, type, privateState, city, state, url, imageId, groupId } = group

  const groupObj = {
    name,
    about,
    type,
    private: privateState,
    city,
    state
  }

  const imageObj = {
    url,
    preview: true
  }

  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(groupObj)
  })
  const groupRes = await res.json()
  if (res.ok) {
    await dispatch(editGroup(groupRes))
    await csrfFetch(`/api/group-images/${imageId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(imageObj)
    })
  }
  return groupRes
}

export const removeGroup = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  })
  const data = await res.json()
  if (res.ok) {
    await dispatch(deleteGroup(groupId))
  }
  return data
}

const initialState = {
  allGroups: {},
  singleGroup: {}
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
    case ADD_GROUP: {
      newState = { ...state }
      newState.allGroups[action.group.id] = action.group
      return newState
    }
    case EDIT_GROUP: {
      newState = { ...state }
      newState.allGroups[action.group.id] = action.group
      return newState
    }
    case DELETE_GROUP: {
      newState = { ...state }
      delete newState[action.groupId]
      return newState
    }
    default:
      return state
  }
}

export default groupsReducer
