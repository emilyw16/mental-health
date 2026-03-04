/**
 * Helpers for @rn-primitives/select which on native passes { value, label }
 * to onValueChange instead of a string. Use these so we always work with
 * plain string values (e.g. for DB enums) without repeating the normalization.
 */

export type SelectOption = { value: string; label: string };

/** Normalize Select onValueChange payload to a string (native sends { value, label }). */
export function parseSelectValue(
  value: string | SelectOption | undefined,
): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  return value.value;
}

/** Build the Option shape for Select's value prop from current string + options list. */
export function toSelectOption(
  value: string | null | undefined,
  options: SelectOption[],
): SelectOption | undefined {
  if (value == null) return undefined;
  const option = options.find((o) => o.value === value);
  return option ?? { value, label: value };
}
