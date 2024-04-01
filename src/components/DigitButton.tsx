import React from "react"
import { CalculaterStateActions } from "../App"

type DigitButtonProps = {
  dispatch: React.Dispatch<CalculaterStateActions>
  digit: string
}

export default function DigitButton(props: DigitButtonProps) {
  return (
    <button
      onClick={() =>
        props.dispatch({ type: "add-digit", payload: props.digit })
      }
    >
      {props.digit}
    </button>
  )
}
