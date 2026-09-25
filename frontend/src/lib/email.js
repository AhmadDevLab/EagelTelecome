const DOMAIN = import.meta.env.VITE_FAKE_EMAIL_DOMAIN || 'gmail.com'

function randomDigits() {
  const digitCount = Math.random() < 0.5 ? 2 : 3
  const min = 10 ** (digitCount - 1)
  const max = 10 ** digitCount - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function previewEmail(firstName, lastName) {
  const base = `${firstName}${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')

  return base ? `${base}${randomDigits()}@${DOMAIN}` : ''
}
