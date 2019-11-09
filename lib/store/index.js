import { original, produce } from "immer"
import { useDispatch, useSelector } from "react-redux"
export { original, useSelector }

/**
 * Hook that returns a `patch` method that patches at the given selector.
 *
 * @param {Function} selector
 */
export function usePatch(selector = s => s) {
  const dispatch = useDispatch()
  return function(patcher) {
    dispatch({
      type: "patch",
      patcher(proxy) {
        const subproxy = selector(proxy)
        const arity = patcher.length
        if (arity <= 1) {
          patcher(subproxy)
        } else {
          patcher(subproxy, original(subproxy))
        }
      },
    })
  }
}

export function useStore(selector = s => s) {
  if (typeof selector !== "function") throw "selector must be a function"
  const substore = useSelector(selector)
  const patch = usePatch(selector)
  return [substore, patch]
}

export function reducers(state, action) {
  switch (action.type) {
    case "patch":
      return produce(state, function(proxy) {
        return action.patcher(proxy)
      })
  }
  return state
}
