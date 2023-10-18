const validateUser = (email, password) => {
    const validEmail = typeof email === "string" && email.trim() !== "";
    const validPassword =
      typeof password === "string" && password.trim().length > 0;
  
    return validEmail && validPassword;
  };
  
  module.exports = validateUser;
  