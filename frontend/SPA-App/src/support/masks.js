export const applyMaskToCpfCnpj = cpf_cnpj => {
  let maskedField = cpf_cnpj
  maskedField = maskedField.replace(/[^\d]/g, "")
  if (maskedField.length > 3) {
    maskedField = [maskedField.slice(0, 3), ".", maskedField.slice(3)].join("")
    if (maskedField.length > 7) {
      maskedField = [maskedField.slice(0, 7), ".", maskedField.slice(7)].join("")
    }
    if (maskedField.length > 11) {
      maskedField = [maskedField.slice(0, 11), "-", maskedField.slice(11)].join("")
      if (maskedField.length > 14) {
        maskedField = maskedField.replace(/[^\d]/g, "")
        maskedField = [
          maskedField.slice(0, 2),
          ".",
          maskedField.slice(2, 5),
          ".",
          maskedField.slice(5, 8),
          "/",
          maskedField.slice(8)
        ].join("")
        if (maskedField.length > 15) {
          maskedField = [maskedField.slice(0, 15), "-", maskedField.slice(15)].join("")
        }
        if (maskedField.length > 18) maskedField = maskedField.substr(0, 18)
      }
    }
  }
  return maskedField
}

export const applyMaskToCnpj = cnpj => {
  let maskedField = cnpj
  maskedField = maskedField.replace(/[^\d]/g, "")
  if (maskedField.length > 2) {
    maskedField = [maskedField.slice(0, 2), ".", maskedField.slice(2)].join("")
    if (maskedField.length > 6) {
      maskedField = [maskedField.slice(0, 6), ".", maskedField.slice(6)].join("")
    }
    if (maskedField.length > 10) {
      maskedField = [maskedField.slice(0, 10), "/", maskedField.slice(10)].join("")
      if (maskedField.length > 14) {
        maskedField = maskedField.replace(/[^\d]/g, "")
        maskedField = [
          maskedField.slice(0, 2),
          ".",
          maskedField.slice(2, 5),
          ".",
          maskedField.slice(5, 8),
          "/",
          maskedField.slice(8)
        ].join("")
        if (maskedField.length > 15) {
          maskedField = [maskedField.slice(0, 15), "-", maskedField.slice(15)].join("")
        }
        if (maskedField.length > 18) maskedField = maskedField.substr(0, 18)
      }
    }
  }
  return maskedField
}

export const applyMaskToPhone = phone => {
  let maskedField = phone
  maskedField = maskedField.replace(/[^\d]/g, "")
  if (maskedField.length > 0) {
    maskedField = `(${maskedField}`
    if (maskedField.length > 3) {
      maskedField = [maskedField.slice(0, 3), ") ", maskedField.slice(3)].join("")
    }
    if (maskedField.length > 12) {
      if (maskedField.length > 13) {
        maskedField = [maskedField.slice(0, 10), "-", maskedField.slice(10)].join("")
      } else {
        maskedField = [maskedField.slice(0, 9), "-", maskedField.slice(9)].join("")
      }
    }
    if (maskedField.length > 15) maskedField = maskedField.substr(0, 15)
  }
  return maskedField
}


export const applyMaskToRg = rg => {
  let maskedField = rg
  maskedField = maskedField.split('.').join("").split('-').join("")
  if (maskedField.length > 2) {
    maskedField = [maskedField.slice(0, 2), ".", maskedField.slice(2)].join("")
    if (maskedField.length > 6) {
      maskedField = [maskedField.slice(0, 6), ".", maskedField.slice(6)].join("")
    }
    if (maskedField.length > 10) {
      maskedField = [maskedField.slice(0, 10), "-", maskedField.slice(10)].join("")
    }
    if (maskedField.length > 13) maskedField = maskedField.substr(0, 13)
  }
  return maskedField
}

export const getOnlyNumberFromString = string => {
  return string.replace(/[^\d]/g, "")
}

export const maskYearModel = value => {
  return value
    .replace(/(\d{4})(\d)/, '$1/$2')
}

export const maskCpf = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const maskRenavam = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
}

export const maskBirthday = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
}

export const maskDateMY = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
}

export const maskMileage = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{3})$/, '$1.$2')
}


export const maskCoin = value => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d)(\d{2})$/, "$1,$2")
}