import React, { useReducer, useCallback } from 'react';
import './index.css';

const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  if (operation == null || currentOperand == null || previousOperand == null) return '';

  const expression = `${previousOperand} ${operation} ${currentOperand}`;
  try {
    return Function(`return ${expression}`)().toString();
  } catch (error) {
    return 'Error';
  }
}

const Button = React.memo(({ dispatch, type, digit, operation, children, className }) => {
  const handleClick = useCallback(() => {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } });
        break;
      case ACTIONS.CHOOSE_OPERATION:
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } });
        break;
      case ACTIONS.CLEAR:
        dispatch({ type: ACTIONS.CLEAR });
        break;
      case ACTIONS.DELETE_DIGIT:
        dispatch({ type: ACTIONS.DELETE_DIGIT });
        break;
      case ACTIONS.EVALUATE:
        dispatch({ type: ACTIONS.EVALUATE });
        break;
      default:
        break;
    }
  }, [dispatch, type, digit, operation]);

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
});

const App = () => {
  const [{ currentOperand }, dispatch] = useReducer(reducer, {});

  return (
    <div id="calculator">
      <input id="display" value={currentOperand ?? ''} readOnly />
      <div id="keys">
        <Button dispatch={dispatch} type={ACTIONS.CLEAR} className="operator-key">C</Button>
        <Button dispatch={dispatch} type={ACTIONS.DELETE_DIGIT}>DEL</Button>
        <Button dispatch={dispatch} type={ACTIONS.CHOOSE_OPERATION} operation="/">/</Button>
        <Button dispatch={dispatch} type={ACTIONS.CHOOSE_OPERATION} operation="*">*</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="7">7</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="8">8</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="9">9</Button>
        <Button dispatch={dispatch} type={ACTIONS.CHOOSE_OPERATION} operation="+">+</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="4">4</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="5">5</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="6">6</Button>
        <Button dispatch={dispatch} type={ACTIONS.CHOOSE_OPERATION} operation="-">-</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="1">1</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="2">2</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="3">3</Button>
        <Button dispatch={dispatch} type={ACTIONS.EVALUATE} className="operator-key">=</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit="0">0</Button>
        <Button dispatch={dispatch} type={ACTIONS.ADD_DIGIT} digit=".">.</Button>
      </div>
    </div>
  );
};

export default App;
