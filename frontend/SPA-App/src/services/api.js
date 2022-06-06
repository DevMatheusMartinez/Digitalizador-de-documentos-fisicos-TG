import axios from "axios"
import {history} from "../history"

const api =
  process.env.NODE_ENV === "development" ? axios.create({
    baseURL: `http://localhost:8000/api/`
  }) : axios.create({
    baseURL: `https://api.masterrevenda.com.br/api/`
  })

api.interceptors.request.use(async (config) => {
  try {
    const token = await localStorage.getItem("@masterrevenda-app:token")

    config.headers.Accept = `application/json`

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  } catch (err) {
    // TODO
  }
})

api.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401 && error.response.data.message === "Unauthenticated.") {
    localStorage.removeItem("@masterrevenda-app:token")
    history.push("/login")
  }
  return error.response
})

export default api
