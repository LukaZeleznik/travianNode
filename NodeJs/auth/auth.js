const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
  };

passport.use(
    new JWTstrategy({
            secretOrKey: 'RgUkXp2s5v8y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRfUjXn2r5u8x!A%D*',
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor])
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'register',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            console.log(req);
            try {
                const tribe = req.query.tribe;
                const nickname = req.query.nickname;
                const capital = Math.floor((Math.random() * 95) + 1);
                
                console.log("tribe: ", tribe);
                console.log("nickname: ", nickname);
                console.log("capital:", capital);

                const user = await UserModel.create({
                    email,
                    password,
                    nickname,
                    tribe,
                    capital
                });

                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            try {
                const user = await UserModel.findOne({
                    email
                });

                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }

                return done(null, user, {
                    message: 'Logged in Successfully'
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);