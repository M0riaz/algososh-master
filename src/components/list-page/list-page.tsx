import React, { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './list.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedListNode } from "./class";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { ElementStates } from "../../types/element-states";

interface IList {
    item: string;
    color: ElementStates;
    head?: boolean;
    tail?: boolean;
    add?: boolean;
    delete?: boolean;
    miniCircle?: {
        name: string;
    };
}

export const ListPage: React.FC = () => {
    const defaultArray: number[] = [0, 1, 7, 45, 12];
    const initArr: Array<IList> = defaultArray.map((item, index, array) => ({
        item: `${item}`,
        color: ElementStates.Default,
        add: false,
        delete: false,
        head: index === 0 ? true : false,
        tail: index === array.length - 1 ? true : false,
    }));

    const [inputValue, setInputValue] = useState("");
    const [list, setList] = useState(new LinkedListNode<any>(initArr));
    const [array, setArray] = useState<Array<IList>>(initArr);
    const [input, setInput] = useState<number | null>(null);
    const [loader, setLoader] = useState(false);
    const [activeButton, setActiveButton] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputValue(e.target.value);
    };

    const handleInputIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInput(Number(e.currentTarget.value));
    };

    const handleAddToHead = () => {
        if (inputValue) {
            setLoader(true);
            setActiveButton("head");
            setInputValue('');
            array[0] = {
                ...array[0],
                add: true,
                head: false,
                miniCircle: { name: inputValue },
            };
            setArray([...array]);
            setTimeout(() => {
                list.prepend(inputValue);
                array[0] = {
                    ...array[0],
                    add: false,
                    head: false,
                    miniCircle: undefined,
                };
                setArray([...array]);
                array.unshift({ item: inputValue, color: ElementStates.Modified });
                setArray([...array]);
                setTimeout(() => {
                    array[0] = {
                        ...array[0],
                        color: ElementStates.Default,
                        head: true,
                    };
                    setArray([...array]);
                    setLoader(false);
                    setActiveButton("");
                }, 1000);
            }, 1000);
        }
    };

    const handleDeleteHead = () => {
        if (array.length > 0) {
            setLoader(true);
            setActiveButton("deleteHead");
            array[0] = {
                ...array[0],
                delete: true,
                head: false,
                miniCircle: {
                    name: array[0].item,
                },
            };
            setArray([...array]);
            setTimeout(() => {
                list.deleteHead();
                const newArray = array.slice(1);
                if (newArray.length > 0) {
                    newArray[0].head = true;
                }
                setArray(newArray);
                setLoader(false);
                setActiveButton("");
            }, 1000);
        }
    };

    const handleAddToTail = () => {
        if (inputValue) {
            setLoader(true);
            setActiveButton("tail");
            setInputValue('');
            array[array.length - 1] = {
                ...array[array.length - 1],
                add: true,
                tail: false,
                miniCircle: {
                    name: inputValue,
                },
            };
            setArray([...array]);
            setTimeout(() => {
                list.append(inputValue);
                array[array.length - 1] = {
                    ...array[array.length - 1],
                    add: false,
                    tail: false,
                    miniCircle: undefined,
                };
                setArray([...array]);
                array.push({ item: inputValue, color: ElementStates.Modified });
                setArray([...array]);
                setTimeout(() => {
                    array[array.length - 1] = {
                        ...array[array.length - 1],
                        color: ElementStates.Default,
                        tail: true,
                    };
                    setArray([...array]);
                    setLoader(false);
                    setActiveButton("");
                }, 1000);
            }, 1000);
        }
    };

    const handleDeleteTail = () => {
        if (array.length > 0) {
            setLoader(true);
            setActiveButton("deleteTail");
            const lastIdx = array.length - 1;
            array[lastIdx] = {
                ...array[lastIdx],
                delete: true,
                tail: false,
                miniCircle: {
                    name: array[lastIdx].item,
                },
            };
            setArray([...array]);
            setTimeout(() => {
                list.deleteTail();
                const newArray = array.slice(0, lastIdx);
                if (newArray.length > 0) {
                    newArray[newArray.length - 1].tail = true;
                }
                setArray(newArray);
                setLoader(false);
                setActiveButton("");
            }, 1000);
        }
    };

    const handleAddByIndex = (index: number) => {
        if (inputValue) {
            if (index < 0 || index > array.length) {
                console.log("Enter a valid index");
                return;
            }
            setLoader(true);
            setActiveButton(`addIndex${index}`);
            setInputValue("");
            setInput(null);
            let currentIndex = 0;
            const highlightNextElement = () => {
                if (currentIndex <= index) {
                    const updatedArray = array.map((el, i) => {
                        if (i === currentIndex) {
                            return {
                                ...el,
                                color: ElementStates.Changing,
                                miniCircle: { name: inputValue },
                                add: true,
                                head: index === 0 ? true : undefined,
                            };
                        } else if (i <= currentIndex) {
                            return {
                                ...el,
                                color: ElementStates.Changing,
                                head: undefined,
                            };
                        } else {
                            return {
                                ...el,
                                miniCircle: undefined,
                            };
                        }
                    });
                    setArray(updatedArray);
                    currentIndex++;
                    setTimeout(highlightNextElement, 1000);
                } else {
                    list.addByIndex(inputValue, index);
                    const newArray = [
                        ...array.slice(0, index),
                        {
                            item: inputValue,
                            color: ElementStates.Modified,
                            head: index === 0 ? true : undefined,
                            tail: index === array.length ? true : undefined,
                        },
                        ...array.slice(index),
                    ];
                    setArray(newArray);
                    setTimeout(() => {
                        const updatedArray = [...newArray];
                        updatedArray[index] = {
                            ...updatedArray[index],
                            color: ElementStates.Default,
                        };
                        setArray(updatedArray);
                        setLoader(false);
                        setActiveButton("");
                    }, 1000);
                }
            };
            highlightNextElement();
            if (index === 0) {
                array[0] = { ...array[0], head: false };
            }
            if (index === array.length) {
                array[array.length - 1] = { ...array[array.length - 1], tail: false };
            }
        }
    };

    const handleDeleteByIndex = (index: number) => {
        if (index < 0 || index >= array.length) {
            console.log("Enter a valid index");
            return;
        }
        setLoader(true);
        setActiveButton(`deleteIndex${index}`);
        const highlightNextElement = async () => {
            setInput(null);
            for (let i = 0; i <= index; i++) {
                array[i] = {
                    ...array[i],
                    color: ElementStates.Changing,
                    head: undefined,
                    tail: undefined,
                };
                setArray([...array]);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            array[index] = {
                ...array[index],
                delete: true,
                miniCircle: { name: array[index].item },
            };
            setArray([...array]);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const newArray = array.filter((_, i) => i !== index);
            if (newArray.length > 0) {
                newArray[0].head = true;
                newArray[newArray.length - 1].tail = true;
            }
            const updatedArray = newArray.map((el) => ({
                ...el,
                color: ElementStates.Default,
            }));
            setArray(updatedArray);
            setLoader(false);
            setActiveButton("");
        };
        highlightNextElement();
    };

    return (
        <SolutionLayout title="Связный список">
            <div className={style.main}>
                <form className={style.form}>
                    <div className={style.listContainer}>
                        <Input
                            extraClass={style.input}
                            placeholder={"Введите значение"}
                            maxLength={4}
                            isLimitText={true}
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={loader}
                        />
                        <Button
                            disabled={!inputValue || loader || activeButton === "head"}
                            text={"Добавить в head"}
                            onClick={handleAddToHead}
                            isLoader={loader && activeButton === "head"}
                        />
                        <Button
                            disabled={!inputValue || loader || activeButton === "tail"}
                            text={"Добавить в tail"}
                            onClick={handleAddToTail}
                            isLoader={loader && activeButton === "tail"}
                        />
                        <Button
                            disabled={ loader || activeButton === "head"}
                            text={"Удалить из head"}
                            onClick={handleDeleteHead}
                            isLoader={loader && activeButton === "deleteHead"}
                        />
                        <Button
                            disabled={loader || activeButton === "tail"}
                            text={"Удалить из tail"}
                            onClick={handleDeleteTail}
                            isLoader={loader && activeButton === "deleteTail"}
                        />
                    </div>
                    <div className={style.indexContainer}>
                        <Input
                            extraClass={style.input}
                            placeholder={"Введите индекс"}
                            type="number"
                            onChange={handleInputIndexChange}
                            value={input == null ? '' : input}
                            disabled={loader}
                        />
                        <Button
                            disabled={(input === null) || (inputValue === '') || loader || activeButton.includes("addIndex")}
                            text={"Добавить по индексу"}
                            extraClass={style.button}
                            onClick={() => handleAddByIndex(input ?? 0)}
                            isLoader={loader && activeButton.includes("addIndex")}
                        />
                        <Button
                            disabled={(input === null) || loader || activeButton.includes("deleteIndex")}
                            text={"Удалить по индексу"}
                            extraClass={style.button}
                            onClick={() => handleDeleteByIndex(input ?? 0)}
                            isLoader={loader && activeButton.includes("deleteIndex")}
                        />
                    </div>
                </form>
                <div className={style.circles}>
                    {array.map((el, index) => (
                        <div className={style.container} key={index}>
                            {el.add && (
                                <Circle
                                    isSmall={true}
                                    letter={el.miniCircle?.name}
                                    extraClass={style.add}
                                    state={ElementStates.Changing}
                                />
                            )}
                            <div className={style.circle} key={index}>
                                <Circle
                                    index={index}
                                    letter={el.item}
                                    head={el.head ? "Head" : undefined}
                                    tail={el.tail ? "Tail" : undefined}
                                    state={el.color}
                                />
                                {index !== array.length - 1 && <ArrowIcon />}
                            </div>
                            {el.delete && (
                                <Circle
                                    isSmall={true}
                                    letter={el.item}
                                    extraClass={style.delete}
                                    state={ElementStates.Changing}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </SolutionLayout>
    );
};