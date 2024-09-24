import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJGnNXKuadh4PzMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1jcmllbGVxYTZ6NXZlbnl5LnVzLmF1dGgwLmNvbTAeFw0yNDA5MjQw
MzE1MTdaFw0zODA2MDMwMzE1MTdaMCwxKjAoBgNVBAMTIWRldi1jcmllbGVxYTZ6
NXZlbnl5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAM5bKjquF5s7JfjfAR2tguDa08zcAbuAwr/cg8XaPwspgFj4Ucra4KKI4Fa8
KL1Pfu6INwmp2wO2xhtGXzuc9le83ZCYftrmuJxtiV9Mec36fJhW0+Te4tcqXMnh
W+yLiW2tz2LU9A9s8uWF8PIirhia+re93fXNXhXTOWu/tl4gg6bfmtn7GU6CjMgc
AQdo4OTJsQ2a6ijp7H5Zv8h2tL/xUBFsIMD3AF+9OAkZucYAybQDV5BiL+w+6dSp
vS5EmHjeEHDrC91PQ6mY5xFw9Kb2HcWPUQlAez+t5uEoaD2biFNrNXjhztw0SSfe
Oml66z/r+MedBUJ+sdTlY7LzhLUCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUm9txxjU8IkN3ehNNkDSzuswNLVQwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBuV/9l9px+Tq8J5SDhfPlLzBAsh9tZGg6WZn35lhie
4oMP08s2N7Kxd4naT4ESE+isEQJzyQs5GZqj+IaVIi49eIqIwqkktfiIoKbct/sL
a/5wWyPQSok/wO4mUrMoQihI/i8B7ACcJJSHl0BY3AYzCBE8HAf2g977uQhWYzIp
+W5uMPQM0oVB2lVMgYylJ/VLUJ/KNoAxAEFJglF7y2WmunluzBElYYRytxC011cr
ZlWl8ulwgkuwvvV2z42ZpU/usZ/OrcLw+A2CwKZD4PozZS3WqYAXhKzS6r8AsHO6
fdEOoqR0Y0sb2vsgznwJsjXfBkW2lzfA9IZmj8KTRsby
-----END CERTIFICATE-----`


const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
