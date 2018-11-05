import * as React from 'react'

export function useTextInput(
  initialValue: string,
): [
  string,
  (newState: string) => void,
  {
    type: "text"
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    value: string
  }
] {
  const [value, set] = React.useState(initialValue)
  return [
    value,
    set,
    {
      type: "text",
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => set(event.target.value),
      value,
    },
  ]
}

export function useNumberInput(
  initialValue: number,
): [
  number,
  (newState: number) => void,
  {
    type: 'number',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    value: string,
  }
] {
  const [value, set] = React.useState(initialValue)
  return [
    value,
    set,
    {
      type: 'number',
      onChange: e => set(parseFloat(e.target.value)),
      value: value.toString(),
    }
  ]
}