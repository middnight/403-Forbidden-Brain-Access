module.exports = {

  database: 'mongodb://amity:police100@ds245518.mlab.com:45518/amity',
  port: 8080,
  secretKey: 'shivamgiri420',
  facebook: {
    //code required for app to get login access from 'amity' app created in developers.facebook.com
    clientID: '186772235386412',
    clientSecret: '68ac3f35c08cb3a9052136eb8910963d',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    passReqToCallback: true,
  }

}
