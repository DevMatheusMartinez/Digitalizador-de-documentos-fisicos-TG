import api from "./api"

const generatePdf = (sale) => {
  api.get(`sales/${sale.uuid}/generatePdf`, {
    responseType: 'arraybuffer',
    headers: {Accept: 'application/pdf'}
  }).then(function (response) {
    const blob = new Blob([response.data], {
      type: 'application/pdf'
    })
    const url = window.URL.createObjectURL(blob)
    window.open(url)
  })
}

export default generatePdf
