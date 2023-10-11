export class Node<T> {
    value: T;
    next: Node<T> | null;
    constructor(value: T, next?: Node<T> | null) {
        this.value = value;
        this.next = next === undefined ? null : next;
    }
}

interface ILinkedList<T> {
    append: (element: T) => void;
    prepend: (element: T) => void;
    addByIndex: (element: T, position: number) => void;
    deleteByIndex: (index: number) => void;
    deleteHead: () => void;
    deleteTail: () => void;
    toArray: () => T[];
}

export class LinkedListNode<T> implements ILinkedList<T> {
    private head: Node<T> | null;
    private size: number;

    constructor(initArr: T[]) {
        this.head = null;
        this.size = 0;
        initArr.forEach((item, indx) => {
            this.addByIndex(item,indx)
        })
    }

    addByIndex(element: T, index: number) {
        if (index < 0 || index > this.size) {
            console.log('Enter a valid index');
            return;
        }

        const node = new Node(element);

        if (index === 0) {
            node.next = this.head;
            this.head = node;
        } else {
            let curr = this.head;
            let prev = null;
            let currIndex = 0;

            while (currIndex < index) {
                prev = curr;
                curr = curr!.next;
                currIndex++;
            }

            node.next = curr;
            prev!.next = node;
        }

        this.size++;
    }

    deleteByIndex(index: number) {
        if (index < 0 || index >= this.size) {
            console.log('Enter a valid index');
            return;
        }

        if (index === 0) {
            this.head = this.head!.next;
        } else {
            let curr = this.head;
            let prev = null;
            let currIndex = 0;
            while (currIndex < index) {
                prev = curr;
                curr = curr!.next;
                currIndex++;
            }
            if (prev && curr) {
                prev.next = curr.next;
            }
        }

        this.size--;
    }

    prepend(element: T) {
        const node = new Node(element);
        node.next = this.head;
        this.head = node;
        this.size++;
    }

    deleteHead() {
        if (this.head ) {
            this.head = this.head.next;
            this.size--;
        }


    }

    append(element: T) {
        const node = new Node(element);

        if (this.head === null) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }

        this.size++;
    }

    deleteTail() {
        if (!this.head) {
            console.log('The list is empty.');
            return;
        }
        if (!this.head.next) {
            this.head = null;
            this.size--;
            return;
        }
        let current = this.head;
        let previous: Node<T> | null = null;
        while (current.next) {
            previous = current;
            current = current.next;
        }
        if (previous) {
            previous.next = null;
        }
        this.size--;
    }

    toArray(): T[] {
        const array: T[] = [];
        let current = this.head;
        while (current !== null) {
            array.push(current.value);
            current = current.next;
        }
        return array;
    }

}
