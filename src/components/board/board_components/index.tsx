import Areas from "./areas"
import Note from "./note"


function PlaceComponents({name,props}:{name:string,props:any}) {
    switch(name){
        case "note":{
            return <Note id={props}/>
        }
        
        default :{
            return <div>not found</div>
        }
    }
}
export default PlaceComponents