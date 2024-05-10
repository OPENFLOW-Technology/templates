import jwt from "jsonwebtoken"
require('dotenv').config()

const signToken = (id: any) => {
  const token = jwt.sign({ uid: id }, process.env.JWT_SECRET, {
    expiresIn: '20d',
  });
  return token;
};

export default signToken;