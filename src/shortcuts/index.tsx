import { useAreas } from '../context/para/areas';



export function initShortcuts() {
  
    document.addEventListener("keydown", (e) => {
    let AlteShortCuts = new Map([
      ['e', () => useAreas.getState().toggleEditable()],
      ['n', () => { }],
      ['', () => { }],
      ['', () => { }],
      ['', () => { }],
    ]);
    AlteShortCuts.forEach((action, key) => {
      if (e.altKey) {
        if (e.key == key) {
          let item = AlteShortCuts.get(key);
          if (item) {
            item()
          }
        }
      }
    })
  })

}