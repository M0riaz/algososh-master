import React, {FormEvent, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import style from './fibonacci.module.css'
import {Circle} from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {
    const [fibonacciArr, setFibonacciArr] = useState<string[]>([]);
    const [isLoad, setIsLoad] = useState(false);
    const [number, setNumber] = useState("");

    const fibFnc = (n: number): string[] => {
        const array = [1, 1];
        for (let i = 2; i < n + 1; i++) {
            array.push(array[i - 2] + array[i - 1]);
        }
        return array.map((num) => num.toString());
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoad(true);
        setFibonacciArr([]);
        const fibArray = fibFnc(Number(number));
        fibArray.forEach((num, index) => {
            setTimeout(() => {
                setFibonacciArr((prevArr) => [...prevArr, num]);
                if (index === fibArray.length - 1) {
                    setIsLoad(false);
                }
            }, (index + 1) * 500);
        });
    };

    return (
        <SolutionLayout title="Последовательность Фибоначчи">
            <div className={style.container}>
                <form className={style.form} onSubmit={handleSubmit}>
                    <Input
                        type="number"
                        isLimitText={true}
                        max={19}
                        min={1}
                        onChange={(e:FormEvent<HTMLInputElement>) => setNumber(e.currentTarget.value)}
                    />
                    <Button
                        type="submit"
                        text="Рассчитать"
                        isLoader={isLoad}
                    />
                </form>
                <div className={style.output}>
                    {fibonacciArr.map((letter, index) => (
                        <div key={index} className={style.circle}>
                            <Circle
                                letter={letter}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </SolutionLayout>
    );
};
