import React, { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
function App() {


  // 入力したtodoの取得
  const [inputText, setInputText] = useState("");
  // 入力した日付の取得
  const [inputDate, setInputDate] = useState("");

  // 空の配列に何が入るかを指定する(Todoで宣言した3つの配列を持つ型)
  const [todos , setTodos] = useState<Todo[]>([]);
  // 完了ボタン 
  const [completetodos, setCompletetodos] = useState<Todo[]>([
    
  ]);
 
 
  // 型を指定しておく
  type Todo = {
    inputText:string;
    id:string;
    checked:boolean;
    // 日付の型が分からない
    targetDate:string;

  }

  // 入力したTodo
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  // 完了予定日の取得
  const targetDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value)
    // console.log(event.target.value);   
  }

  // リスト追加の処理
  const onSubmitTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 新しいTodo作成
    const newTodos :Todo= {
      inputText : inputText,
      id:uuidv4(),
      checked:false,
      targetDate : inputDate,
    };
    // console.log(newTodos.id)
    setTodos([newTodos, ...todos]);
    setInputText("");
    setInputDate("");
    // console.log(setTodos([newTodos, ...todos]))
  }

   //unique IDの変数
   const uniqueId = uuidv4();

  // 編集するidと入力値を取得する。引数名はなんでもいいのか
  const handleEdit = (id:string, inputText:string) => {
    const newTodos = todos.map((todo) => {
      // todoのidがIDに等しい場合編集できる
      if (todo.id === id) {
        todo.inputText = inputText; //編集している文字列のこと
      }
      // リターンで返す意味
      return todo;
    })

    // 左辺と右辺の型がマッチしてない　todos
    setTodos(newTodos);

  }

  // 未完了削除ボタン
  const onClickDelete = (id:string) => {
  const remaindTodos = todos.filter((todo) => todo.id !== id );
  setTodos(remaindTodos);
  }

  // 完了削除
  const completeDelete = (id:string) => {
  const newCompleteTodos = todos.filter((todo) => todo.id !== id );
  setCompletetodos(newCompleteTodos);
  }



  // 完了ボタン
  const onClickComplete = (index:any) => {
  
    const newIncompleteTodos = [...todos];
    newIncompleteTodos.splice(index, 1);


    const newCompleteTodos = [...completetodos,todos[index]];
    setTodos(newIncompleteTodos);
    setCompletetodos(newCompleteTodos);
  }



  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={(event)=> onSubmitTodoAdd(event)}>
      <input onChange={(event) =>handleChange(event)}type="text" value={inputText}className='inputText'/>
      <input onChange={(event) =>targetDate(event)} name="date" type="date" value={inputDate}className='inputDate' />
      <input onChange={() => {}} type="submit" value="追加" className="submitButton" />
      </form>
      <div className='container'>
        <div className='inProgressList'>
          <h2>完了予定/内容</h2>
          <ul>
            {todos.map((todo,index) => (
              <li key={todo.id} className='inProgress' >
                <span className='tobeDone'>{todo.targetDate}</span>
                <input onChange={(event) =>handleEdit(todo.id,event.target.value)}
                type="text" value={todo.inputText} 
                className='inputText'/>
                <div className='buttonWrap'>
                  <button onClick={()=> onClickComplete(index)}className='completeButton'>完了</button>
                  <button onClick={()=>onClickDelete(todo.id)} className='deleteButton'>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='doneList'>
          <h2>完了リスト</h2>
          <ul>
            {completetodos.map((todo,index) => (
              <li key={uniqueId} className='done' >
                <span className='tobeDone'>{todo.targetDate}</span>
                <input
                disabled
                type="text" 
                value={todo.inputText} 
                className='doneInputText'/>
                <div className='buttonWrap'>
                  <button onClick={()=> onClickComplete(index)} className='backButton'>戻す</button>
                  <button onClick={()=>completeDelete(todo.id)}  className='deleteButton'>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
