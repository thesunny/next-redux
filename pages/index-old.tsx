import nanoid from "nanoid"
import styled from "@emotion/styled"
import { useDepartment } from "/lib/store"
import { useState } from "react"

const Container = styled.div`
  padding: 1em 2em;
`
const Title = styled.h1``

const AddTodo = styled.div`
  display: flex;
  margin-bottom: 1em;
  input {
    flex: 0 0 250px;
    margin-right: 0.5em;
  }
  button {
    flex: 0 0 auto;
  }
`

function Entry() {
  const [todos, setTodos] = useDepartment(s => s.todos)
  const [text, setText] = useState("")

  function addTodo() {
    setTodos(todos => {
      todos.push({ id: nanoid(), text, completed: false })
      setText("")
    })
  }
  return (
    <Container>
      <Title>Hello World</Title>
      <AddTodo>
        <input
          className="form-control"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTodo}>
          Add todo
        </button>
      </AddTodo>
      {todos.map((todo, i) => {
        function onChange(e) {
          setTodos(todos => {
            todos[i].completed = e.target.checked
          })
        }
        function remove(e) {
          setTodos(todos => {
            delete todos[i]
          })
        }
        return (
          <div key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={onChange}
            />{" "}
            {todo.text}
            <span
              className="ml-2"
              style={{ cursor: "pointer" }}
              onClick={remove}
            >
              x
            </span>
          </div>
        )
      })}
    </Container>
  )
}

Entry.getInitialProps = function() {
  return {
    todos: [
      { id: 1, text: "Clean the house", completed: false },
      { id: 2, text: "Bake a pie", completed: false },
      { id: 3, text: "Watch TV", completed: true },
    ],
  }
}

export default Entry
