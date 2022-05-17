// NOTE code taken from:
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

export function escapeRegExp(str: string): string {
  // NOTE $& means the whole matched string
  return str.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")
}
