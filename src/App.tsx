import React, { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { InputTodos } from './components/InputTodos';
import { InProgressList } from './components/InProgressList';
import { DoneList } from './components/DoneList';

// firebase を読み込む
import db from './firebase';
import { collection, getDocs } from "firebase/firestore"; 

function App() {

  // 入力したtodoの取得
  const [inputText, setInputText] = useState("");
  // 入力した日付の取得
  const [inputDate, setInputDate] = useState("");

  // 空の配列に何が入るかを指定する(Todoで宣言した3つの配列を持つ型)
  const [todos , setTodos] = useState<Todo[]>([]);

  // firebase　リロードしてからデータを取得する
  // データベースと連携してデータを取ってくる
  useEffect(() => {
    // データベースからデータを読み取る
    const TodoData = collection(db,"todos");
    getDocs(TodoData).then((snapShot) => {
      // console.log(snapShot.docs.map((doc) => doc.data()));
      setTodos(snapShot.docs.map((doc) => ({...doc.data()})))
    })

  },[])


  // 完了ボタン 
  const [completetodos, setCompletetodos] = useState<Todo[]>([]);



  // 型を指定しておく
  type Todo = {
    inputText:string;
    id:string;
    // checked:boolean;
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
      // checked:false,
      targetDate : inputDate,
    };
    setTodos([newTodos, ...todos]);
    setInputText("");
    setInputDate("");
  }

  
  // 編集するidと入力値を取得する。引数名はなんでもいいのか
  const handleEdit = (id:string,inputText:string) => {

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
  const remainTodos = todos.filter((todo) => todo.id !== id );
  setTodos(remainTodos);
  }

  // 完了削除
  const completeDelete = (id:string) => {
  const newRemainCompleteTodos = completetodos.filter((todo) => todo.id !== id );
  // console.log(newRemainCompleteTodos)
  setCompletetodos(newRemainCompleteTodos);
  }

  // 完了ボタン
  const onClickComplete = (id:string) => {
    // 残されたリスト
    const newIncompleteTodos= todos.filter((todo) => todo.id !== id );
    // 選択したtodo
    const targetIncompleteTodos = todos.filter((todo) => todo.id === id );
    const newCompleteTodos= [...completetodos,...targetIncompleteTodos]
    setTodos(newIncompleteTodos);
    setCompletetodos(newCompleteTodos)
  }

  // 戻すボタン
  const onClicBack = (id:string) => {
        // 残されたリスト
        const newCompleteTodos= completetodos.filter((todo) => todo.id !== id );
        // 選択したtodo
        const targetCompleteTodos = completetodos.filter((todo) => todo.id === id );
        const newIncompleteTodos= [...targetCompleteTodos,...todos]
        setTodos(newIncompleteTodos);
        setCompletetodos(newCompleteTodos)
  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      <InputTodos inputText={inputText}inputDate={inputDate} onSubmitTodoAdd={onSubmitTodoAdd} handleChange={handleChange} targetDate={targetDate} />
      <div className='container'>
      <InProgressList todos={todos} handleEdit={handleEdit} onClickComplete={onClickComplete} onClickDelete={onClickDelete} />
      <DoneList completetodos={completetodos} onClicBack={onClicBack} completeDelete={completeDelete}/>
      </div>
    </div>
  );
}

export default App;
