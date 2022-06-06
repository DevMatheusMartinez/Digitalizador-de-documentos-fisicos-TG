// ** Initial State
const initialState = {
  suggestions: [],
  bookmarks: [],
  query: '',
  tabs: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      active: false,
      navLink:'/home',
      state: null
    }
  ],
  tab: {}
}

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navbar/CHANGE_ACTIVE_TAB':
      return { ...state }

    case 'navbar/ADD_TAB':
      return {
        ...state,
        tabs: action.payload.tabs
      }
    
    case 'navbar/UPDATE_TABS':
      return {
        ...state,
        tabs: action.payload.tabs
      }

    default:
      return state
  }
}

export default navbarReducer
