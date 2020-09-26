import { DependencyList, useEffect } from "react"


export const useUnsafeEffect = (callable: CallableFunction, deps?: DependencyList) => {
  useEffect(() => {
    callable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}