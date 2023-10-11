import React, {useState} from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './stack.module.css'
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Stack} from "./class";
import {ElementStates} from "../../types/element-states";
import {Circle} from "../ui/circle/circle";

interface IElement {
  value: string;
  color: ElementStates;
}

export const StackPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [stack] = useState(new Stack<string>());
  const [array, setArray] = useState<Array<IElement>>([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };
  const handleAdd = () => {

    if (inputValue.trim() !== "") {
      stack.push(inputValue);
      setInputValue("");
      const elements = stack.elements().map((element) => ({
        value: element,
        color: ElementStates.Default,
      }));
      setArray(elements);

      const end = elements.length - 1;
      elements[end].color = ElementStates.Changing;
      setArray([...elements]);

      setTimeout(() => {
        elements[end].color = ElementStates.Default;
        setArray([...elements]);
      }, 500);
    }
  };

  const handleDelete = () => {
    if (stack.size() > 0) {
      const elements = stack.elements().map((element) => ({
        value: element,
        color: ElementStates.Default,
      }));
      const end = elements.length - 1;
      elements[end].color = ElementStates.Changing;
      setArray([...elements]);
      setTimeout(() => {
        stack.pop();
        elements.pop();
        setArray([...elements]);
      }, 500);
    }
  };

  const handleClear = () => {
    setArray([]);
    stack.clear();
  }

  return (
    <SolutionLayout title="Стек">
      <div className={style.container}>
        <form className={style.form}>
          <Input
              type={'text'}
              maxLength={4}
              max={4}
              placeholder={'Введите значение'}
              isLimitText={true}
              onChange={onChange}
              value={inputValue}
          />
          <Button
              disabled={inputValue? false : true}
              text={'Добавить'}
              onClick={handleAdd}
          />
          <Button
              text={'Удалить'}
              onClick={handleDelete}
              disabled={stack.size() > 0 ? false : true}
          />
          <Button
              text={'Очистить'}
              extraClass={style.button}
              onClick={handleClear}
              disabled={stack.size() > 0 ? false : true}
          />
        </form>
        <div className={style.output}>
          {array.map((element, index) => (
              <Circle
                  state={element.color}
                  letter={element.value}
                  key={index}
                  index={index}
                  head={array.length - 1 === index ? 'top' : ''}
              />
          ))}
        </div>
      </div>
    </SolutionLayout>
  );
};
