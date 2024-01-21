import React, { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { InputTodos } from './components/InputTodos';
import { InProgressList } from './components/InProgressList';
import { DoneList } from './components/DoneList';
import Modal from "react-modal";

// firebase を読み込む
import db from './firebase';
import { collection,onSnapshot,doc,deleteDoc, setDoc,getDocs, QuerySnapshot, updateDoc} from "firebase/firestore"; 

// https://react-tm-todolist.web.app

function App() {
  // 入力したtodoの取得
  const [inputText, setInputText] = useState("");

  // 入力した日付の取得
  const [inputDate, setInputDate] = useState("");

  // モーダル開く
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);


  // 空の配列に何が入るかを指定する(Todoで宣言した3つの配列を持つ型)
  const [todos , setTodos] = useState<Todo[]>([]);

  // 完了ボタン 
  const [completetodos, setCompletetodos] = useState<Todo[]>([]);

  // 編集
  const [editingId, setEditingId] = useState<string>("");
  // const [targetTodo, setTargettodo] = useState<Todo[]>([]);

  // firebase　リロードしてからデータを取得する
  // データベースと連携してデータを取ってくる
  useEffect(() => {
    const Tododata = collection(db,'todos');
    // リアルタイムで取得
    onSnapshot(Tododata, (todo) => {
      setTodos(todo.docs.map((doc) => ({...doc.data()as Todo})));
    });

// 完了リストを読み込む
    const Completedata = collection(db,'completetodos');
    getDocs(Completedata).then((querySnapshot)=>{
     setCompletetodos(querySnapshot.docs.map((doc)=>doc.data()as Todo))
    })


  },[])


  // 型を指定しておく
  type Todo = {
    inputText:string;
    id:string;
    targetDate:string;
  }

  // 入力したTodo
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }


  // 完了予定日の取得 日付のエラーを表示させたい(当日以降の日付を入力してください)
  const targetDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value)
    
    //本日の日付の取得
    const today = new Date();
    const newToday = Number(today.toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit",
    day: "2-digit"}).replaceAll('/', ''))

    // 入力した日付の取得
    const targetDate = Number((event.target.value).replaceAll('-',''));
    console.log(targetDate);
    console.log(newToday);
    
   const calcDate = targetDate-newToday
   calcDate < 0 && alert('当日以降の日付を入力してください') ;

  }




  // リスト追加の処理
  const onSubmitTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const id = uuidv4();

  setDoc(doc(db,"todos",id),{
    id,
    inputText:inputText,
    targetDate:inputDate,
  })


  // 新しいTodo作成
  const newTodos :Todo= {
    inputText : inputText,
    id,
    targetDate : inputDate,
  };

  setTodos([newTodos, ...todos]);
  setInputText("");
  setInputDate("");
  }


  const onClickEdit = (clickedTodo:Todo) =>{
// モーダルが開く
          setEditModalIsOpen(true)
          setInputText(clickedTodo.inputText);
          setInputDate(clickedTodo.targetDate);
          setEditingId(clickedTodo.id);
    };

    const EditTodo = async(id:string) => {
      const editedTodos = todos.map((todo) => {
        return todo.id === id ? {...todo, inputText, targetDate: inputDate} : todo;  // 編集中のTodoのみ更新
      });

      await updateDoc(doc(db, "todos",id), {
        id,
        inputText:inputText,
        targetDate:inputDate,
      });

      setTodos(editedTodos);
      closeModal();
    }

    const closeModal = () => {
    // モーダル閉じる
    setEditModalIsOpen(false)
    setEditingId("");
    setInputDate("")
    setInputText("");

  }

    

/* =============================================
未完了リスト */

  // 未完了リスト削除ボタン
  const onClickDelete = async(id:string) => {
  const remainTodos = todos.filter((todo) => todo.id !== id );
    // firebaseのデータベースデータを削除する
  await deleteDoc(doc(db,"todos",id))
  setTodos(remainTodos);

  }

    // 未完了リストの完了ボタン(完了リストに移動させる)
    const onClickComplete = (todo:Todo) => {

      // 残されたリスト
      const newIncompleteTodos= todos.filter((incompleteTodo) => incompleteTodo.id !== todo.id );
      // 選択したtodo
      const targetIncompleteTodos = todos.filter((incompleteTodo) => incompleteTodo.id === todo.id );
      // console.log('aaa');
      
      const newCompleteTodos= [...completetodos,...targetIncompleteTodos]
      deleteDoc(doc(db,"todos",todo.id))
    
      // firebaseのデータベースにデータを追加する
      setDoc(doc(db, "completetodos",todo.id), {
        id:todo.id,
        inputText:todo.inputText,
        targetDate:todo.targetDate,
      });

      setCompletetodos(newCompleteTodos)
      setTodos(newIncompleteTodos);
    }


  /* =============================================
./未完了リスト */

/* =============================================
完了リスト */

  // 完了リスト削除ボタン
  const completeDelete = async(id:string) => {
    const newRemainCompleteTodos = completetodos.filter((todo) => todo.id !== id );
    // console.log(newRemainCompleteTodos)
    setCompletetodos(newRemainCompleteTodos);
    await deleteDoc(doc(db,"completetodos",id))
    }

  // 戻すボタン
  const onClicBack = async(todo:Todo) => {
        // 残されたリスト
        const newCompleteTodos= completetodos.filter((completeTodo) => completeTodo.id !== todo.id );
        // 選択したtodo
        const targetCompleteTodos = completetodos.filter((completeTodo) => completeTodo.id === todo.id );
        const newIncompleteTodos= [...targetCompleteTodos,...todos]
        await deleteDoc(doc(db,"completetodos",todo.id))
              // firebaseのデータベースにデータを追加する
      await setDoc(doc(db, "todos",todo.id), {
        id:todo.id,
        inputText:todo.inputText,
        targetDate:todo.targetDate,
      });
        setTodos(newIncompleteTodos);
        setCompletetodos(newCompleteTodos)
  }
/* =============================================
./完了リスト */

  return (
    <div className="App">
      <h1>Todo List</h1>
      <InputTodos 
        inputText={inputText}
        inputDate={inputDate} 
        onSubmitTodoAdd={onSubmitTodoAdd}
        handleChange={handleChange} 
        targetDate={targetDate} 
      />
      <div className='container'>
        <InProgressList 
          todos={todos} 
          onClickComplete={onClickComplete} 
          onClickDelete={onClickDelete} 
          onClickEdit={onClickEdit}
          buttonText={'編集'}
        />
        <Modal isOpen={editModalIsOpen} className="editModal">
          <div className='EditTodo'>
            <input  name="date" type="date" value= {inputDate}onChange={(e) => setInputDate(e.target.value)}className='EditTodoText' />
            <input type="text" placeholder={inputText} onChange={(e) => setInputText(e.target.value)}className='inputText'/>
          </div>
          <button className="closeButton" onClick={() =>EditTodo(editingId)}>完了</button>
        </Modal>
        <DoneList 
          completetodos={completetodos} 
          onClicBack={onClicBack} 
          completeDelete={completeDelete}
        />
      </div>
    </div>
    
  );
}

export default App;
