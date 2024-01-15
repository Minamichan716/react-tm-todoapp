
export const InProgressList = ({todos,onClickComplete,onClickDelete,onClickEdit,buttonText}) => {
    
  
  
  
  return(
        <div className='inProgressList'>
          <h2>進行中</h2>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className='inProgress' >
                <span className='tobeDone'>期限：{todo.targetDate}</span>
                <input 
                type="text" value={todo.inputText} 
                className='inputText'/>
                <div className='buttonWrap'>
                  <button onClick={()=> onClickEdit(todo.id)}className='EditButton'>{buttonText}</button>
                  <button onClick={()=> onClickComplete(todo.id)}className='completeButton'>完了</button>
                  <button onClick={()=>onClickDelete(todo.id)} className='deleteButton'>削除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
    )
}