import React from "react"
import { CalculaterStateActions } from "../App"

type OperationButtonProps = {
  dispatch: React.Dispatch<CalculaterStateActions>
  operation: string
}

export default function OperationButton(props: OperationButtonProps) {
  return (
    <button
      onClick={() =>
        props.dispatch({ type: "choose-operation", payload: props.operation })
      }
    >
      {props.operation}
    </button>
  )
}
