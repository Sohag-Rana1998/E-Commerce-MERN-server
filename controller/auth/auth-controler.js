const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../../models/user");

// register

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const checkUser = await user.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User Already Exits.Please try again",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const uniqueName = email.split("@")[0];

    const newUser = new user({
      fullName: name,
      userName: uniqueName,
      email,
      password: hashPassword,
    });
    await newUser.save();

    res.status(200).json({
      success: "true",
      message: "Registered successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: "false",
      message: "Some error occured",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await user.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User Not Found.Please try again",
      });
    }

    const passwordMatch = await bcrypt.compare(password, checkUser.password);
    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Wrong Credentials.Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        fullName: checkUser.fullName,
      },
      "USER-SECRET-KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Login Successfull",
      user: {
        name: checkUser.fullName,
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: "false",
      message: "Some error occured",
    });
  }
};

const logOutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged Out Successfully",
  });
};

const authMiddleWare = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
        success: false,
      message: "Unauthorized user",
    });
  }
  try {
    const decoded = jwt.verify(token, "USER-SECRET-KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
};
module.exports = { registerUser, loginUser, logOutUser, authMiddleWare };
