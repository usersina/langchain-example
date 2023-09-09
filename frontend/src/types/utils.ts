/**
 * Get the element type of an array.
 *
 * Example:
 * ```ts
 * const arr = [1, 2, 3] as const
 * type ArrType = ElementType<typeof arr> // 1 | 2 | 3
 * ```
 */
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never
