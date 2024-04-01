import { useReducer } from "react"
import styled from "styled-components"
import { Reducer } from "react"
import DigitButton from "./components/DigitButton"
import OperationButton from "./components/OperationButton"

const Layout = styled.div`
  justify-content: center;
  margin-top: 10rem;
  display: grid;
  grid-template-columns: repeat(4, 6rem);

  grid-template-rows: minmax(7rem, auto) repeat(5, 6rem);
  .span-two {
    grid-column: span 2;
  }

  .output {
    grid-column: 1 / -1;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    padding: 0.75rem;
    word-wrap: break-word;
    word-break: break-all;
  }

  .output .pre-output {
    color: rgba(255, 255, 255, 0.75);
    font-size: 1.5rem;
  }

  .output .current-output {
    color: white;
    font-size: 2.5rem;
  }

  > button {
    cursor: pointer;
    font-size: 2rem;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid white;
    outline: none;

    &:hover,
    :focus {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
`

export type CalculaterReducer = Reducer<CalculaterState, CalculaterStateActions>

type CalculaterState = {
  currentOperand: string
  previousOperand: string
  operation: string
}

export type CalculaterStateActions =
  | { type: "add-digit"; payload: string }
  | { type: "delete-digit"; payload: string }
  | { type: "choose-operation"; payload: string }
  | { type: "clear"; payload: string }
  | { type: "evaluate"; payload: string }

export type Action = {
  type: "add-digit" | "delete-digit" | "clear" | "choose-operation" | "evaluate"
  payload: string
}

const reducer = (state: CalculaterState, action: Action): CalculaterState => {
  switch (action.type) {
    case "add-digit":
      if (action.payload === "0" && state.currentOperand === "0") return state
      if (action.payload === "." && state?.currentOperand?.includes("."))
        return state
      return {
        ...state,
        currentOperand: state?.currentOperand + action?.payload,
      }

    case "clear":
      return { currentOperand: "", operation: "", previousOperand: "" }

    case "choose-operation":
      if (state.currentOperand.length === 0)
        return {
          ...state,
          operation: action.payload,
        }

      if (state.previousOperand.length === 0)
        return {
          ...state,
          operation: action.payload,
          previousOperand: state.currentOperand,
          currentOperand: "",
        }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload,
        currentOperand: "",
      }
    default:
    case "evaluate":
      if (
        state.currentOperand.length === 0 ||
        state.previousOperand.length === 0 ||
        state.operation.length === 0
      )
        return state

      return {
        ...state,
        previousOperand: "",
        operation: "",
        currentOperand: evaluate(state),
      }

    case "delete-digit":
      if (state.currentOperand.length === 0) return state
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: "" }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
  }
}

function evaluate(state: CalculaterState): string {
  const prev = parseFloat(state.previousOperand)
  const current = parseFloat(state.currentOperand)

  if (isNaN(prev) || isNaN(current)) return ""

  let result = 0
  switch (state.operation) {
    case "+":
      result = prev + current
      break
    case "-":
      result = prev - current
      break

    case "*":
      result = prev * current
      break

    case "/":
      result = prev / current
      break
  }
  return result.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function format(operand: string) {
  if (!operand) return
  const [interger, decimal] = operand.split(".")
  if (!decimal) return INTEGER_FORMATTER.format(parseFloat(interger))
  return `${INTEGER_FORMATTER.format(parseFloat(interger))}.${decimal}`
}

export function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] =
    useReducer<CalculaterReducer>(reducer, {
      currentOperand: "",
      previousOperand: "",
      operation: "",
    })

  return (
    <Layout>
      <div className="output">
        <div className="pre-output">
          {format(previousOperand)} {operation}
        </div>
        <div className="current-output">{format(currentOperand)}</div>
      </div>

      <button
        onClick={() => dispatch({ type: "clear", payload: "" })}
        className="span-two"
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: "delete-digit", payload: "" })}>
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        onClick={() => dispatch({ type: "evaluate", payload: "" })}
        className="span-two"
      >
        =
      </button>
    </Layout>
  )
}
