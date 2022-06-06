import React from "react"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import generatePdf from "../contracts/generatePDF"

const MySwal = withReactContent(Swal)

export const SweetAlertSuccess = (title, text, icon, funcConfirm) => {
  return MySwal.fire({
    title,
    text,
    icon,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      funcConfirm()
    } 
  })
}

export const SweetAlertSuccessPDF = (title, text, icon, funcConfirm, funcPDF) => {
  return MySwal.fire({
    title,
    text,
    icon,
    customClass: {
      confirmButton: 'btn btn-primary',
      denyButton: 'btn btn-danger'
    },
    showDenyButton: true,
    denyButtonText: 'Gerar PDF',
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      funcConfirm()
    } else if (result.isDenied) {
      funcPDF()
    }
  })
}

export const SweetAlertQuestion = (title, text, icon, funcConfirm, funcDenied) => {
  return Swal.fire({
    title,
    text,
    icon,
    showDenyButton: true,
    confirmButtonText: 'Sim',
    denyButtonText: `Não`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      funcConfirm()
    } else if (result.isDenied) {
      funcDenied()
    }
  })
}