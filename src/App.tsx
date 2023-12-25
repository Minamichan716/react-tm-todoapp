import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Todo List</h1>
        <form>
        <input type="text" value="仕事"className='inputText'/>
        <input type="submit" value="追加" className="submitButton" />
        </form>
      <div className='container'>

        <div className='inProgressList'>
          <h2>進行中</h2>
          <ul>
            <li className='inProgress'>宿題
            <div className='buttonWrap'>
            <button className='completeButton'>完了</button>
            <button className='deleteButton'>削除</button>

            </div>
            </li>
            <li className='inProgress'>卵・牛乳を買う
            <div className='buttonWrap'>
            <button className='completeButton'>完了</button>
            <button className='deleteButton'>削除</button>

            </div>
            </li>
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
