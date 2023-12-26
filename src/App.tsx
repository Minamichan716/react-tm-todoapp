import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // 入力したtodoの取得
  const [inputText, setInputText] = useState("");
  // 入力した日付の取得
  const [inputDate, setInputDate] = useState("");


  // 空の配列に何が入るかを指定する(Todoで宣言した3つの配列を持つ型)
  const [todos , setTodos] = useState<Todo[]>([]);


  // 型を指定しておく
  type Todo = {
    inputText:string;
    id:number;
    checked:boolean;
    // 日付の型が分からない
    targetDate:any;

  }

  // 入力したTodo
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
    console.log(event.target.value);
    
  }

  // 完了予定日の取得
  const targetDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value)
    console.log(event.target.value);
    
  }

  // リスト追加の処理
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 新しいTodo作成
    const newTodos :Todo= {
      inputText : inputText,
      id:todos.length,
      checked:false,
      targetDate : inputDate,
    };

    setTodos([newTodos, ...todos]);
    setInputText("");
    setInputDate("");

  }

  // 編集するidと入力値を取得する。引数名はなんでもいいのか
  const handleEdit = (id:number, inputText:string) => {
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



  return (
    <div className="App">
      <h1>Todo List</h1>
        <form onSubmit={(event)=> handleSubmit(event)}>
        <input onChange={(event) =>handleChange(event)}type="text" className='inputText'/>
        <input onChange={(event) =>targetDate(event)} name="date" type="date" className='inputDate' />
        <input onChange={() => {}} type="submit" value="追加" className="submitButton" />
        </form>
      <div className='container'>

        <div className='inProgressList'>
          <h2>完了予定/内容</h2>
          <ul>
            {/* <li className='inProgress'>明日する
            <div className='buttonWrap'>
            <button className='completeButton'>完了</button>
            <button className='deleteButton'>削除</button>

            </div>
            </li> */}
            {/* <li className='inProgress'>明日買う
            <div className='buttonWrap'>
            <button className='completeButton'>完了</button>
            <button className='deleteButton'>削除</button>

            </div>
            </li> */}
            {todos.map((todo) => (
              <li key={todo.id} className='inProgress' ><span className='tobeDone'>{todo.targetDate}</span><input onChange={(event) =>handleEdit(todo.id,event.target.value)}type="text" value={todo.inputText} className='inputText'/>
                          <div className='buttonWrap'>
            <button className='completeButton'>完了</button>
            <button className='deleteButton'>削除</button>

            </div>
              </li>
            ))}

          </ul>
        </div>
        <div className='doneList'>
        <h2>完了リスト</h2>
          <ul>
            <li className='done'>ご飯食べる
            <div className='buttonWrap'>
            <button className='backButton'>戻す</button>
            <button className='deleteButton'>削除</button>
            </div>
            </li>
            <li className='done'>掃除選択大掃除
            <div className='buttonWrap'>
            <button className='backButton'>戻す</button>
            <button className='deleteButton'>削除</button>
            </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
