
export const InProgressList = ({todos,handleEdit,onClickComplete,onClickDelete}) => {
    
  
  
  
  return(
        <div className='inProgressList'>
          <h2>進行中</h2>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className='inProgress' >
                <span className='tobeDone'>期限：{todo.targetDate}</span>
                <input onChange={(event) =>handleEdit(todo.id,event.target.value)}
                type="text" value={todo.inputText} 
                className='inputText'/>
                <div className='buttonWrap'>
                  <button onClick={()=> onClickComplete(todo.id)}className='completeButton'>完了</button>
                  <button onClick={()=>onClickDelete(todo.id)} className='deleteButton'>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
    )
}