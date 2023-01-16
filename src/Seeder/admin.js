/**
 * Check if there is an admin account
 * Create One if it doesnt exist
*/

const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const password = "admin123";

exports.seedAdmin = async () => {
    
        // Check if there is an admin account
        const checkAdmin = await Users.findOne({userRole:"admin"});

        if(checkAdmin) {
            return "Admin already exists"
        }

        // Hash Password
        const salt =  await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create Admin
        const user = await Users.create({
            firstName: "Super",
            lastName: "Admin",
            email: "superadmin@gmail.com",
            password : hashedPassword,
            userRole: "admin"
        })

        const savedUser =  user.save();
        
        if (savedUser) {
            return "Admin account created"
        }
}
