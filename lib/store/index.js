import { useDispatch, useSelector } from "react-redux"

import produce from "immer"

export { useSelector }

export function usePatch() {
  const dispatch = useDispatch()
  return function(fn) {
    dispatch({ type: "patch", fn })
  }
}

export function useDepartment(selector) {
  const department = useSelector(selector)
  const patch = usePatch()

  function setDepartment(fn) {
    patch(function(store) {
      const department = selector(store)
      fn(department)
    })
  }

  function subdepartment(fn) {
    return useDepartment(function(store) {
      return fn(selector(store))
    })
  }

  return [department, setDepartment, subdepartment]
}

const PATCH = "patch"

export function reducers(state, action) {
  let nextState = state
  switch (action.type) {
    case "patch":
      nextState = produce(state, action.fn)
      break
  }
  return nextState
}
