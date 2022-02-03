import React, { createContext, useContext, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.account;
    case 'ADD_ACCOUNT':
      return [...state, action.account];
    // case 'DELETE_ACCOUNT':
    //   return state.filter()
    default:
      return state;
  }
}

const AccountState = createContext();
const AccountDispatch = createContext();

const initial = [];

export function AccountProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <AccountState.Provider value={state}>
      <AccountDispatch.Provider value={dispatch}>
        {children}
      </AccountDispatch.Provider>
    </AccountState.Provider>
  );
}

export function useAccountState() {
  return useContext(AccountState);
}

export function useAccountDispatch() {
  return useContext(AccountDispatch);
}
