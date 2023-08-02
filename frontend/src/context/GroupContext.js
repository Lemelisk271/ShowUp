import { createContext, useState } from "react";

export const GroupContext = createContext()

export const GroupProvider = props => {
  const [currentGroup, setCurrentGroup] = useState({})

  return (
    <GroupContext.Provider value={{currentGroup, setCurrentGroup}}>
      {props.children}
    </GroupContext.Provider>
  )
}

export default GroupProvider
