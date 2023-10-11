import React, { FormEvent, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import style from "./string.module.css";
import { ElementStates } from "../../types/element-states";
import { Circle } from "../ui/circle/circle";

type TWord = {
    value: string;
    color: ElementStates;
};

export const StringComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [array, setArray] = useState<Array<TWord>>([]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputValue(e.target.value);

    };

    const handleClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const word = inputValue.split("").map((value) => ({
            value,
            color: ElementStates.Default,
        }));
        reverseString(word);
    };

    const reverseString = (word: TWord[]) => {
        setIsLoad(true);
        setArray([...word]);

        setTimeout(() => {
            let start = 0;
            let end = word.length - 1;

            const reverseIteration = () => {
                if (start < end) {
                    word[start].color = ElementStates.Changing;
                    word[end].color = ElementStates.Changing;
                    setArray([...word]);

                    setTimeout(() => {
                        let tmp = word[start];
                        console.log(tmp)
                        word[start] = word[end];
                        word[end] = tmp;

                        word[start].color = ElementStates.Modified;
                        word[end].color = ElementStates.Modified;

                        setArray([...word]);
                        start++;
                        end--;
                        setTimeout(reverseIteration, 1000);
                    }, 1000);
                } else if (start === end) {
                    word[start].color = ElementStates.Modified;
                    setArray([...word]);
                    setIsLoad(false);
                } else {
                    setIsLoad(false);
                }
            };

            reverseIteration();
        }, 1000);
    };

    return (
        <SolutionLayout title="Строка">
            <div className={style.container}>
                <form className={style.form} onSubmit={handleClick}>
                    <Input
                        isLimitText={true}
                        maxLength={11}
                        value={inputValue}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        text="Развернуть"
                        disabled={inputValue.length > 0 ? false : true}
                        isLoader={isLoad}
                    />
                </form>
                <div className={style.output}>
                    {array.map((letter, index) => (
                        <Circle letter={letter.value} key={index} state={letter.color} />
                    ))}
                </div>
            </div>
        </SolutionLayout>
    );
};