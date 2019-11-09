import nanoid from "nanoid"
import { original } from "immer"
import styled from "@emotion/styled"
import { useState } from "react"
import { useStore } from "/lib/store/index"

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
  const [list, patchList] = useStore(s => s.entry.list)
  const [todos, patchTodos] = useStore(s => s.entry.todos)
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")

  function addTodo(e) {
    patchTodos(todos => {
      todos.push({ id: nanoid(), text, completed: false })
      setText("")
    })
  }

  return (
    <Container>
      {isEditing ? (
        <div className="mb-3">
          <input
            autoFocus={true}
            className="form-control mb-1"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <div>
            <button
              onClick={() => {
                patchList(list => (list.title = title))
                setIsEditing(false)
              }}
            >
              Save Change
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setTitle(list.title)
              setIsEditing(true)
            }}
          >
            Edit Title
          </button>
          <Title>{list.title}</Title>
        </>
      )}
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
          patchTodos(todos => {
            todos[i].completed = e.target.checked
          })
        }
        function remove(e) {
          patchTodos(todos => {
            todos.splice(i, 1)
          })
        }
        return (
          <div key={todo.id}>
            <input
              className="mr-1"
              type="checkbox"
              checked={todo.completed}
              onChange={onChange}
            />
            {todo.text}
            <span
              className="ml-2 badge badge-secondary"
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
    entry: {
      list: {
        title: "Hello World",
      },
      todos: [
        { id: 1, text: "Clean the house", completed: false },
        { id: 2, text: "Bake a pie", completed: false },
        { id: 3, text: "Watch TV", completed: true },
      ],
    },
  }
}

export default Entry
