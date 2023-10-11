interface IStack<T> {
push: (item: T) => void;
pop: () => void;
size: () => number;
elements: () => T[];
clear: () => void
}

export class Stack<T> implements IStack<T>{
    container: T[] = [];

    push(item: T) {
        this.container.push(item)
    }
    pop(){
        this.container.pop()
    }

    size(){
        return this.container.length
    }
    elements() {
        return this.container
    }
    clear() {
        this.container = []
    }

}