export const changeActiveTab = tabId => {
  return {
    type: 'navbar/CHANGE_ACTIVE_TAB',
    payload: {tabId}
  }
}

export const addTab = tabs => {
  return {
    type: 'navbar/ADD_TAB',
    payload: {tabs}
  }
}

export const updateTabs = tabs => {
  return {
    type: 'navbar/UPDATE_TABS',
    payload: {tabs}
  }
}
