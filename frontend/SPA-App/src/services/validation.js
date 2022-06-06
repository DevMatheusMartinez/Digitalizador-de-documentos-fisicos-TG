import {cnpj} from 'cpf-cnpj-validator'

export const ValidateTenant = (tenant) => {
  const errors = [`Campo obrigátorio`, "Minimo 3 caracteres", "CNPJ inválido"]

  if (tenant.name === undefined || "" || null) {
    return {message: errors[0], field: 'name'}
  }
  if (tenant.name.length < 3) {
    return {message: errors[1], field: 'name'}
  }
  if (tenant.company_name === undefined || "" || null) {
    return {message: errors[0], field: 'company_name'}
  }
  if (tenant.company_name.length < 3) {
    return {message: errors[1], field: 'company_name'}
  }
  if (tenant.cnpj === undefined || "" || null) {
    return {message: errors[0], field: 'cnpj'}
  }
  if (!cnpj.isValid(tenant.cnpj)) {
    return {message: errors[2], field: 'cnpj'}
  }

  return {message: "success"}
}

export const ValidateUser = (user) => {
  const errors = ['Campo obrigátorio', 'Minimo 3 caracteres', "Minimo 4 caracteres", 'As senhas não conferem']
  if (user.name === undefined || "" || null) {
    return {message: errors[0], field: 'name'}
  }
  if (user.name.length < 3) {
    return {message: errors[1], field: 'name'}
  }
  if (user.email === undefined || "" || null) {
    return {message: errors[0], field: 'email'}
  }
  if (user.password === undefined || "" || null) {
    return {message: errors[0], field: 'password'}
  }
  if (user.password.length < 4) {
    return {message: errors[2], field: 'password'}
  }
  if (user.password !== user.password_confirmation) {
    return {message: errors[3], field: 'password'}
  }
  return {message: "success"}
}

const isValidPhone = (phone) => {
  const phoneRegex = /^\(\d{2}\)\s?\d{4}-\d{4}$/
  return phoneRegex.test(phone)
}

const isValidCell = (cell) => {
  const cellRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/
  return cellRegex.test(cell)
}

export const ValidateContact = (contact) => {
  const errors = ["celular inválido", "Telefone inválido"]

  if (contact.type === "Fixo") {
    if (!isValidPhone(contact.contact)) {
      return {message: errors[1], field: 'contact'}
    }
  }
  if (contact.type === "Celular") {
    if (!isValidCell(contact.contact)) {
      return {message: errors[0], field: 'contact'}
    }
  }
  return {message: "success"}

}
