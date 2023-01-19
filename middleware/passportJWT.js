const config = require("../config");
const passport = require("passport");
const passportstaff = require("passport");
const db = require("../config/db");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_ACCESS_SECRET;
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await db.query(
        "SELECT *FROM users WHERE id = ? ",
        [jwt_payload.id],
        (err, results, fields) => {
          if (!err) {
            return results[0];
          }
        }
      );

      if (!user) {
        return done(new Error("User not found"), false);
      }

      return done(null, jwt_payload);
    } catch (error) {
      done(error);
    }
  })
);

module.exports.isLogin = passport.authenticate("jwt", { session: false });

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const tb_staff = await db.query(
        "SELECT FROM tb_staff WHERE ss_id = ? ",
        [jwt_payload.ss_id],
        (err, results, fields) => {
          if (!err) {
            return results[0];
          }
        }
      );

      if (!tb_staff) {
        return done(new Error("tb_staff not found"), false);
      }

      return done(null, jwt_payload);
    } catch (error) {
      done(error);
    }
  })
);

module.exports.isLoginstaff = passport.authenticate("jwt", {
  session: false,
});

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const teacher = await db.query(
        "SELECT FROM tb_teacher WHERE tc_id = ? ",
        [jwt_payload.tc_id],
        (err, results, fields) => {
          if (!err) {
            return results[0];
          }
        }
      );

      if (!teacher) {
        return done(new Error("teacher not found"), false);
      }

      return done(null, jwt_payload);
    } catch (error) {
      done(error);
    }
  })
);

module.exports.isLoginteacher = passport.authenticate("jwt", {
  session: false,
});

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const tb_student = await db.query(
        "SELECT FROM tb_student WHERE std_id = ? ",
        [jwt_payload.std_id],
        (err, results, fields) => {
          if (!err) {
            return results[0];
          }
        }
      );

      if (!tb_student) {
        return done(new Error("tb_student not found"), false);
      }

      return done(null, jwt_payload);
    } catch (error) {
      done(error);
    }
  })
);

module.exports.isLoginstudent = passport.authenticate("jwt", {
  session: false,
});
