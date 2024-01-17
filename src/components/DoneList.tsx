 export const DoneList =({completetodos,onClicBack,completeDelete}) => {
    return (
        <div className='doneList'>
          <h2>完了リスト</h2>
          <ul>
            {completetodos.map((todo) => (
              <li key={todo.id} className='done' >
                <span className='tobeDone'>{todo.targetDate}</span>
                <input
                disabled
                type="text" 
                value={todo.inputText} 
                className='doneInputText'/>
                <div className='buttonWrap'>
                  <button onClick={()=> onClicBack(todo)} className='backButton'>戻す</button>
                  <button onClick={()=>completeDelete(todo.id)}  className='deleteButton'>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
    )
 }