export function changeMode(mode) {
  return {
    type: 'CHANGE_MODE',
    mode
  }
}

export function collapseSidebar(value) {
  return {
    type: 'COLLAPSE_SIDEBAR',
    value
  }
}

export function changeNavbarColor(color) {
  return {
    type: 'CHANGE_NAVBAR_COLOR',
    color
  }
}

export function changeNavbarType(style) {
  return {
    type: 'CHANGE_NAVBAR_TYPE',
    style
  }
}

export function changeFooterType(style) {
  return {
    type: 'CHANGE_FOOTER_TYPE',
    style
  }
}

export function changeMenuColor(style) {
  return {
    type: 'CHANGE_MENU_COLOR',
    style
  }
}

export function hideScrollToTop(value) {
  return {
    type: 'HIDE_SCROLL_TO_TOP',
    value
  }
}
