//      auth Validator

export function authentificationValidation(req, res, next) {
    if (req.body.email === undefined) {
      let err = new Error(JSON.stringify({ msg: "email is undefined" }));
      err.statusCode = 400;
      return next(err);
    }
  
    if (typeof req.body.email !== "string") {
      let err = new Error(JSON.stringify({ msg: "email is not on text format" }));
      err.statusCode = 400;
      return next(err);
    }
  
    if (req.body.password === undefined) {
      let err = new Error(JSON.stringify({ msg: "password is undefined" }));
      err.statusCode = 400;
      return next(err);
    }
  
    if (typeof req.body.password !== "string") {
      let err = new Error(JSON.stringify({ msg: "password is not on text format" }));
      err.statusCode = 400;
      return next(err);
    }

    if (typeof req.body.password === "") {
      let err = new Error(JSON.stringify({ msg: "password is empty" }));
      err.statusCode = 400;
      return next(err);
    }

    if (typeof req.body.email === "") {
      let err = new Error(JSON.stringify({ msg: "email is empty" }));
      err.statusCode = 400;
      return next(err);
    }
  
    next();
  }

  export default authentificationValidation;