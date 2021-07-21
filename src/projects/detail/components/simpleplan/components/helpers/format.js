/* Returns the capitalized, space-separated text */
export function formatCapitalizedText (value) {
  value = value.replace(/-|_/g, ' ')
  return value[0].toUpperCase() + value.slice(1)
}
