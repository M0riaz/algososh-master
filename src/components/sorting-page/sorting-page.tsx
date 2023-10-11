import React, {useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {RadioInput} from "../ui/radio-input/radio-input";
import style from "./sorting.module.css";
import {Button} from "../ui/button/button";
import {Direction} from "../../types/direction";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";

type TSort = {
    value: number;
    color: ElementStates;
};

export const SortingPage: React.FC = () => {
    const [sortedArray, setSortedArray] = useState<TSort[]>([]);
    const [selectedRadio, setSelectedRadio] = useState<string | null>("Выбор");
    const [sortingDirection, setSortingDirection] = useState<Direction>(
        Direction.Ascending
    );
    const [isLoad, setIsLoad] = useState(false);
    const [isBubbleSort, setIsBubbleSort] = useState(false);
    const [isLoadAscending, setIsLoadAscending] = useState(false);
    const [isLoadDescending, setIsLoadDescending] = useState(false);

    const swap = (arr: TSort[], firstIndex: number, secondIndex: number): void => {
        const temp = arr[firstIndex];
        arr[firstIndex] = arr[secondIndex];
        arr[secondIndex] = temp;
    };

    const sortArray = async (): Promise<void> => {
        const sortedArr = [...sortedArray];
        const length = sortedArr.length;

        const compareAndSwapWithDelay = (
            arr: TSort[],
            firstIndex: number,
            secondIndex: number
        ): Promise<void> => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    arr[firstIndex].color = ElementStates.Changing;
                    arr[secondIndex].color = ElementStates.Changing;
                    setSortedArray([...arr]);
                    resolve();
                }, 1000);
            });
        };

        for (let i = 0; i < length; i++) {
            let minIndex = i;
            sortedArr[minIndex].color = ElementStates.Changing;

            for (let j = i + 1; j < length; j++) {
                sortedArr[j].color = ElementStates.Changing;
                setSortedArray([...sortedArr]);
                await new Promise((resolve) => setTimeout(resolve, 500));

                const shouldSwap =
                    (sortingDirection === Direction.Ascending &&
                        sortedArr[j].value < sortedArr[minIndex].value) ||
                    (sortingDirection === Direction.Descending &&
                        sortedArr[j].value > sortedArr[minIndex].value);

                if (shouldSwap) {
                    minIndex = j;
                }

                sortedArr[j].color = ElementStates.Default;
                setSortedArray([...sortedArr]);
            }

            if (minIndex !== i) {
                await compareAndSwapWithDelay(sortedArr, i, minIndex);
                swap(sortedArr, i, minIndex);
            }

            sortedArr[i].color = ElementStates.Modified;

            for (let k = i + 1; k < length; k++) {
                sortedArr[k].color = ElementStates.Default;
            }

            setSortedArray([...sortedArr]);
        }
    };

    const bubbleSort = async (): Promise<void> => {
        setIsLoad(true);
        const sortedArr = [...sortedArray];
        const length = sortedArr.length;
        for (let i = 0; i < length - 1; i++) {
            for (let j = 0; j < length - i - 1; j++) {
                sortedArr[j].color = ElementStates.Changing;
                sortedArr[j + 1].color = ElementStates.Changing;
                setSortedArray([...sortedArr]);
                await new Promise((resolve) => setTimeout(resolve, 500));
                const shouldSwap =
                    (sortingDirection === Direction.Ascending &&
                        sortedArr[j].value > sortedArr[j + 1].value) ||
                    (sortingDirection === Direction.Descending &&
                        sortedArr[j].value < sortedArr[j + 1].value);
                if (shouldSwap) {
                    swap(sortedArr, j, j + 1);
                }
                sortedArr[j].color = ElementStates.Default;
                sortedArr[j + 1].color = ElementStates.Default;
                setSortedArray([...sortedArr]);
            }
            sortedArr[length - i - 1].color = ElementStates.Modified;
            if (sortedArr[length - i - 1]) {
                sortedArr[0].color = ElementStates.Modified;
            }
            setSortedArray([...sortedArr]);
        }
        setIsLoad(false);

    };

    const randomArr = (minLen: number, maxLen: number): number[] => {
        const arr: number[] = [];
        const len = Math.floor(Math.random() * (maxLen - minLen + 1) + minLen);

        for (let i = 0; i < len; i++) {
            arr.push(Math.floor(Math.random() * 101));
        }

        return arr;
    };

    const generateRandomArray = async (): Promise<void> => {
        const newArr = randomArr(3, 17);
        const sortedArr: TSort[] = newArr.map((value) => ({
            value,
            color: ElementStates.Default,
        }));

        await setSortedArray(sortedArr);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    const handleSort = async (direction: Direction): Promise<void> => {
        if (direction === Direction.Ascending) {
            setIsLoadAscending(true);
        } else {
            setIsLoadDescending(true);
        }
        setSortingDirection(direction);
        if (isBubbleSort) {
            await bubbleSort();
        } else {
            await sortArray();
        }
        setIsLoadAscending(false);
        setIsLoadDescending(false);
    };

    return (
        <SolutionLayout title="Сортировка массива">
            <div className={style.container}>
                <form className={style.form}>
                    <div className={style.radio}>
                        <div className={style.radioItem}>
                            <RadioInput
                                label={"Выбор"}
                                checked={selectedRadio === "Выбор"}
                                onChange={() => {
                                    setSelectedRadio(
                                        selectedRadio === "Выбор" ? null : "Выбор"
                                    );
                                    setIsBubbleSort(false);
                                }}
                            />
                        </div>
                        <RadioInput
                            label={"Пузырек"}
                            checked={selectedRadio === "Пузырек"}
                            onChange={() => {
                                setSelectedRadio(
                                    selectedRadio === "Пузырек" ? null : "Пузырек"
                                );
                                setIsBubbleSort(true);
                            }}
                        />
                    </div>
                    <div className={style.sortButton}>
                        <div className={style.button}>
                            <Button
                                isLoader={isLoadAscending}
                                text={"По возрастанию"}
                                sorting={Direction.Ascending}
                                type={"button"}
                                onClick={() => handleSort(Direction.Ascending)}
                                disabled={isLoadDescending}
                            />
                        </div>
                        <Button
                            isLoader={isLoadDescending}
                            text={"По убыванию"}
                            sorting={Direction.Descending}
                            type={"button"}
                            onClick={() => handleSort(Direction.Descending)}
                            disabled={isLoadAscending}
                        />
                    </div>
                    <Button
                        text={"Новый массив"}
                        onClick={generateRandomArray}
                        type={"button"}
                        disabled={isLoadAscending || isLoadDescending}
                    />
                </form>
            </div>
            <div className={style.columns}>
                {sortedArray.map((num, index) => (
                    <Column index={num.value} key={index} state={num.color}/>
                ))}
            </div>
        </SolutionLayout>
    );
};