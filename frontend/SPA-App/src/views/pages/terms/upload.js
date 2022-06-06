export default function UploadPreview(props){
    return (
        <div>
            <form className="ml-1">
                <input type="file" onChange={e => props.setImage(e.target.files[0])} />
                <img width={"900px"} src={props.image ? URL.createObjectURL(props.image) : null } />
            </form>
        </div>
    )
}