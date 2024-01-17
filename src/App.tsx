import React, { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { InputTodos } from './components/InputTodos';
import { InProgressList } from './components/InProgressList';
import { DoneList } from './components/DoneList';
import Modal from "react-modal";

// firebase を読み込む
import db from './firebase';
import { collection,onSnapshot,doc,deleteDoc, setDoc,getDocs, QuerySnapshot} from "firebase/firestore"; 

// https://react-tm-todolist.web.app

function App() {
  // 入力したtodoの取得
  const [inputText, setInputText] = useState("");

  // 入力した日付の取得
  const [inputDate, setInputDate] = useState("");

  // モーダル開く
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  // モーダル閉じる
  const closeModal = () => {
    setEditModalIsOpen(false)
  }
  // 空の配列に何が入るかを指定する(Todoで宣言した3つの配列を持つ型)
  const [todos , setTodos] = useState<Todo[]>([]);

  // 完了ボタン 
  const [completetodos, setCompletetodos] = useState<Todo[]>([]);

  const [targetTodo, setTargettodo] = useState<Todo[]>([]);

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
    // checked:boolean;
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
    // checked:false,
    targetDate : inputDate,
  };

  setTodos([newTodos, ...todos]);
  setInputText("");
  setInputDate("");
  }


  const onClickEdit = (inputText:string,targetDate,id:string) =>{
 const targetTodo = todos.map((todo) => {
    if(todo.id === id) {
      todo.inputText = inputText;
      todo.targetDate = inputDate
      ;
    }
    return todo;
  });

// モーダルが開く
          setEditModalIsOpen(true)
          setTargettodo(targetTodo)
          // setInputText(inputText);
          // setInputDate(inputDate);

    };

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
          {targetTodo.map((todo) => (
          <div className='EditTodo'>
          <input  name="date" type="date" value={todo.targetDate}className='EditTodoText' />
          <input type="text" value={todo.inputText} className='inputText'/>
          </div>
            ))
            }
          <button className="closeButton"onClick={closeModal}>完了</button>
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
