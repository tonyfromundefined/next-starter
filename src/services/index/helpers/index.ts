import jwt from 'jsonwebtoken'

export function checkTokenIsExpired(token: string): boolean {
  const decodedToken = jwt.decode(token)

  return (
    decodedToken === null ||
    typeof decodedToken === 'string' ||
    new Date(decodedToken.exp * 1000) < new Date()
  )
}
