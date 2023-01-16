const {Schema, model} = require("mongoose");

// Create User Schema
const userSchema = new Schema(
    {
        // Defining Properties of the application user
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String
        },
        userRole: {
            type: String,
            enum: ["admin", "tutor", "student", "not assigned"],
            default: "not assigned"
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const userModel = model('users', userSchema);

module.exports = userModel;
