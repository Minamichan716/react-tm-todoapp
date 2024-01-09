export const InputTodos = ({onSubmitTodoAdd,handleChange,targetDate,inputText,inputDate}) => {
    return(
        <form onSubmit={(event)=> onSubmitTodoAdd(event)}>
        <input onChange={(event) =>handleChange(event)}type="text" value={inputText}className='inputText'/>
        <input onChange={(event) =>targetDate(event)} name="date" type="date" value={inputDate}className='inputDate' />
        <input onChange={() => {}} type="submit" value="追加" className="submitButton" />
        </form>
  
    )
}