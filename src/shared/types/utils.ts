/**
 * Remove the variants of the second union of string literals from
 * the first.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

/**
 * Drop keys `K` from `T`.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
 */
export type Omit<T, K extends keyof any> = T extends any
  ? Pick<T, Exclude<keyof T, K>>
  : never

/**
 * Like `T & U`, but where there are overlapping properties using the
 * type from U only.
 *
 * @see Old: https://github.com/pelotom/type-zoo/issues/2
 * @see Old: https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 * @see New: https://github.com/pelotom/type-zoo/pull/14#discussion_r183527882
 */
export type Overwrite<T, U> = Omit<T, keyof T & keyof U> & U

export const propertyOf = <TObj>(name: keyof TObj) => name
