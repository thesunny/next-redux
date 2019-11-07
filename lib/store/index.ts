import { useDispatch, useSelector } from "react-redux"

import produce from "immer"

export { useSelector }

export function usePatch(): Function {
  const dispatch = useDispatch()
  return function(fn: Function) {
    dispatch({ type: "patch", fn })
  }
}

export function useDepartment(selector: Function): [any, Function, Function] {
  const department = useSelector(selector)
  const patch = usePatch()

  function setDepartment(fn: Function) {
    patch(function(store: any): void {
      const department = selector(store)
      fn(department)
    })
  }

  function subdepartment(fn: Function): [any, Function, Function] {
    return useDepartment(function(store: any): any {
      return fn(selector(store))
    })
  }

  return [department, setDepartment, subdepartment]
}

const PATCH = "patch"

interface PatchAction {
  type: typeof PATCH
  fn: Function
}

export function reducers(state: any, action: PatchAction): any {
  let nextState = state
  switch (action.type) {
    case "patch":
      nextState = produce(state, action.fn)
      break
  }
  return nextState
}
