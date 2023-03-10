const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your fisrt name!"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "The password should be at least 6 characters long"],
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number!"],
    unique: true
  },
  country: {
    type: String,
    required: [true, "Please enter your country!"],
  },
  role: {
    type: String,
    required: [true, "Please enter the role of the user!"]
  },
  farms: [ 
    {
      officalNumber: {
        type: String,
        unique: true,
        required: true
      },
      name: {
        type: String,
        unique: [true, "The farm name entered was already taken!"]
      },
      type: {
        type: String
      },
      isDisabled: Boolean,
      government: String,
      city: String,
      landNumber: String,
      landArea: String,
      farmItems: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
          }
        }
      ]
    } 
  ],
  //Not required and used only when reset is requested
  resetToken: String,
  resetTokenExpirtation: Date
}, { timestamps: true }
);

//before saving --> encrypt the password and use salt 
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

//Login Validation Logic
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (isAuthenticated) {
      return user;
    } else {
      throw Error("Incorrect password");
    }
  } else {
    throw Error("Incorrect email");
  }
};

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;