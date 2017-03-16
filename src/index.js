import {OAuth2Strategy as Strategy} from 'passport-google-oauth'

// ===================================================================

export const configurationSchema = {
  type: 'object',
  properties: {
    callbackURL: {
      type: 'string',
      description: 'Must be exactly the same as specified on the Google developer console.'
    },
    clientID: {
      type: 'string'
    },
    clientSecret: {
      type: 'string'
    }
  },
  required: ['callbackURL', 'clientID', 'clientSecret']
}

// ===================================================================

class AuthGoogleXoPlugin {
  constructor ({ xo }) {
    this._conf = null
    this._xo = xo
  }

  configure (conf) {
    this._conf = {
      ...conf,
      scope: 'email profile'
    }
  }

  load () {
    const xo = this._xo

    xo.registerPassportStrategy(new Strategy(this._conf, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile)
        done(null, await xo.registerUser('google', profile.emails[0].value))
      } catch (error) {
        done(error.message)
      }
    }))
  }
}

// ===================================================================

export default opts => new AuthGoogleXoPlugin(opts)
