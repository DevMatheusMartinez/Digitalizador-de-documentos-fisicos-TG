import { Edit, Trash, FileText, Image } from "react-feather"

export const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row)
        }}
      />
      {props.pdf ? <FileText
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.generateRowPDF(props.row.uuid)
        }}
      /> : ''
      }
      {props.image ? <Image
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.openPageImage(props.row)
        }}
      /> : ''}
      <Trash
        className="cursor-pointer"
        size={20}
        onClick={() => {
          props.deleteRow(props.row)
        }}
      />
    </div>
  )
}