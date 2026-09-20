const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push("username should be at least 3 characters");
  }
  if (!email || !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    errors.push("please provide a valid email");
  }

  if (!password || password.length < 6) {
    errors.push("password should be of atleast 6 characters");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email || !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    errors.push("please provide a valid email");
  }

  if (!password || password.length < 6) {
    errors.push("password should be of atleast 6 characters");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export { validateLogin, validateRegister };
