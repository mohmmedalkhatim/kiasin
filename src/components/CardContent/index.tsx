

function CardConten({ T, props }: { T: string, props: any }) {
    let components = new Map([
        ['Task', () => (<div>Task</div>)],
        ['list', () => <div>list</div>],
        ['calunder', () => <div>calunder</div>],
        ['image', () => <div>image</div>],
        ['editor', () => <div>editor</div>],
        ['default', () => <div>'Unknown component</div>],
    ]);
    let action = components.get(T) || components.get('default');
    if (action) {
        action();
    }
}
export default CardConten;