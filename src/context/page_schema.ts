interface Card {
  id: string
  props: any
  content: string
}

class Cards_control{
    list?:Card[]
    getIdsList():Array<String>{
        return this.list?.map(item=>item.id) || []
    }

}
