export const isAuthenticated = () => {
  if (localStorage.getItem("@masterrevenda-app:token")) {
    return true
  }
  return false
}
