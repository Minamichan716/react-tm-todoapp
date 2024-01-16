import React, { useEffect, useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { InputTodos } from './components/InputTodos';
import { InProgressList } from './components/InProgressList';
import { DoneList } from './components/DoneList';
import Modal from "react-modal";

// firebase を読み込む
import db from './firebase';
import { collection,onSnapshot,doc,deleteDoc, setDoc} from "firebase/firestore"; 


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


  // firebase　リロードしてからデータを取得する
  // データベースと連携してデータを取ってくる
  useEffect(() => {
    const Tododata = collection(db,'todos');
    // getDocs(Tododata).then((snapShot) => {
    //   console.log(snapShot.docs.map((doc) => ({...doc.data()})));
    //   setTodos(snapShot.docs.map((doc) => ({...doc.data()as Todo})))
    // })
    // リアルタイムで取得
    onSnapshot(Tododata, (todo) => {
      setTodos(todo.docs.map((doc) => ({...doc.data()as Todo})));
    });

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
    if (calcDate < 0){
      alert('当日以降の日付を入力してください')
    }
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


//   const onClickEdit = (todo:Todo,id:string) =>{
//  todos.filter((todo) => {
//     if(todo.id === id) {
//       todo.inputText = inputText;
//       todo.targetDate = inputDate;
//     }
//     return todo;
//   });

// // モーダルが開く
//           setEditModalIsOpen(true)
//           setInputText(inputText);
//           setInputDate(inputDate);

//     };

  const onClickEdit = (clickedTodo: Todo) => {
    setEditModalIsOpen(true)
    setInputText(clickedTodo.inputText)
    setInputDate(clickedTodo.targetDate)
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
    const onClickComplete = async(todo:Todo,id) => {

      // 残されたリスト
      const newIncompleteTodos= todos.filter((todo) => todo.id !== id );
      // 選択したtodo
      const targetIncompleteTodos = todos.filter((todo) => todo.id === id );
      const newCompleteTodos= [...completetodos,...targetIncompleteTodos]
  
      // await deleteDoc(doc(db,"todos",todo.id))
      // firebaseのデータベースにデータを追加する
      await setDoc(doc(db, "completetodos",todo.id), {
        id:todo.id,
        inputText:todo.inputText,
        targetDate:todo.targetDate,
      });
  
          setTodos(newIncompleteTodos);
          setCompletetodos(newCompleteTodos)
        }


  /* =============================================
./未完了リスト */

/* =============================================
完了リスト */

  // 完了リスト削除ボタン
  const completeDelete = (id:string) => {
    const newRemainCompleteTodos = completetodos.filter((todo) => todo.id !== id );
    // console.log(newRemainCompleteTodos)
    setCompletetodos(newRemainCompleteTodos);
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
          {/* モーダルは編集したいtodo一つのみを表示させてばOKなのでmapを使用して複数表示はしない */}
          {/* {todos.map((todo) => ( */}
            <div className='EditTodo'>
              <input  name="date" type="date" value={inputDate}className='EditTodoText' />
              <input type="text" value={inputText} className='inputText'/>
            </div>
          {/* ))} */}
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
