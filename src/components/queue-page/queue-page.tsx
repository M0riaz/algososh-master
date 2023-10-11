import React, {FormEvent, useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import style from './queue.module.css';
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {Queue} from "./class";
import {ElementStates} from "../../types/element-states";

type TQueue = {
  value: string | number | null;
  color: ElementStates;
};

export const QueuePage: React.FC = () => {
  const [isLoad, setIsLoad] = useState(false);
  const [queue, setQueue] = useState(new Queue<TQueue>(7));
  const [array, setArray] = useState<Array<TQueue>>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const circleArr: TQueue[] = new Array(7).fill({
    value: "",
    color: ElementStates.Default,
  });

  useEffect(() => {
    setArray(circleArr);
  }, []);

  const handleAdd = () => {
    if (inputValue) {
      setInputValue("");
      queue.enqueue({ value: inputValue, color: ElementStates.Default });
      setQueue(queue);
      const updatedArray = [...array];
      const tailIndex = queue.getTail() - 1;
      updatedArray[tailIndex] = {
        value: inputValue,
        color: ElementStates.Changing,
      };
      setArray(updatedArray);

      setTimeout(() => {
        setArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[tailIndex] = {
            value: inputValue,
            color: ElementStates.Default,
          };
          return newArray;
        });
      }, 1000);
    }
  };

  const handleRemove = () => {
    if (!queue.isEmpty()) {
      setIsLoad(true);
      const headIndex = queue.getHead();
      const updatedArray = [...array];
      updatedArray[headIndex] = {
        value: "",
        color: ElementStates.Changing,
      };
      setArray(updatedArray);

      setTimeout(() => {
        queue.dequeue();
        setQueue(queue);
        setArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[headIndex] = {
            value: "",
            color: ElementStates.Default,
          };
          setIsLoad(false);
          return newArray;
        });
      }, 1000);
    }
  };

  const handleClear = () => {
    queue.clear();
    setArray(circleArr);
  };

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.currentTarget.value);
  };

  return (
      <SolutionLayout title="Очередь">
        <div className={style.container}>
          <form className={style.form}>
            <Input
                type={"text"}
                maxLength={4}
                max={4}
                placeholder={"Введите значение"}
                isLimitText={true}
                value={inputValue}
                onChange={onChange}
            />
            <Button
                text={"Добавить"}
                onClick={handleAdd}
                disabled={!inputValue || queue.getTail() === 7}
            />
            <Button
                isLoader={isLoad}
                text={"Удалить"}
                onClick={handleRemove}
                disabled={queue.isEmpty()? true: false}
            />
            <Button
                text={"Очистить"}
                extraClass={style.button}
                onClick={handleClear}
                disabled={queue.isEmpty()? true: false}
            />
          </form>
          <div className={style.output}>
            {array.map((element, index) => (
                <Circle
                    key={index}
                    letter={String(element.value)}
                    index={index}
                    state={element.color}
                    head={element.value && queue.getHead() === index ? "head" : ""}
                    tail={element.value && queue.getTail() - 1 === index ? "tail" : ""}
                />
            ))}
          </div>
        </div>
      </SolutionLayout>
  );
};