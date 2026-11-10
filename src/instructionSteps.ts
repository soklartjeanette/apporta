export function readStep(value: string) {
  const [instruction, ...reminder] = value.split(/\r?\n/)
  return { instruction, reminder: reminder.join('\n') }
}

export function writeStep(instruction: string, reminder: string) {
  const text = instruction.trim().replace(/\s*\r?\n\s*/g, ' ')
  const note = reminder.trim()
  return text && note ? `${text}\n${note}` : text
}
