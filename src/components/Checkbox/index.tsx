import "./style.css"

function Checkbox({state,title}:{state:boolean,title:string}) {
    return (
        <div className="checkbox-wrapper-46">
            <input className="inp-cbx" id="cbx-46" type="checkbox"  />
            <label className="cbx" htmlFor="cbx-46"><span>
                <svg width="12px" height="10px" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg></span>{title?<span>{title}</span>:""}
            </label>
        </div>
    )
}
export default Checkbox