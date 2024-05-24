
import {
  createUserCustomer,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getallUsers,
  GetUserPassword,
} from "../services/userService";
import Email from "../utils/mailer";

import bcrypt from "bcrypt";

export const addCustomer = async (req, res) => {
  try {
    if (!req.body.nid || !req.body.firstname || !req.body.phone || req.body.lastname === "" || req.body.tinnumber === "" ||  !req.body.email || req.body.email === "" || !req.body.password || req.body.password === ""
  ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all information",
      });
    }


    const userExist = await getUserByEmail(req.body.email);
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    if (req.body.password!=req.body.comfirmpassword) {
      return res.status(400).json({
        success: false,
        message: "password mis match",
      });
    }

    const role='customer'
    req.body.role=role;
     
    const newUser = await createUserCustomer(req.body);
    newUser.password = '(keek it secreate)';
    await new Email(newUser).sendAccountAdded();

 

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,  
        lastname: newUser.lastname,  
        phone: newUser.phone,  
        tinnumber: newUser.tinnumber,  
        nid: newUser.nid,  
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const addAdmin = async (req, res) => {
  try {
 

    const userExist = await getUserByEmail(req.body.email);
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // const role='employee'
    req.body.role='employee';
    const password = `D${Math.random().toString(36).slice(-8)}`;
    req.body.password = password;
    console.log(password);

    const newUser = await createUserCustomer(req.body);
    newUser.password = password;
    await new Email(newUser,null).sendAccountAdded();


    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,  
        lastname: newUser.lastname,  
        phone: newUser.phone,  
        tinnumber: newUser.tinnumber,  
        nid: newUser.nid,  
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    let users;
      users = await getallUsers();

      if (req.user.role == "employee" || req.user.role == "customer") {

        users = [];
      }
      if (req.user.role === "superadmin") {
  
        users = users.filter(user => user.role === 'employee');
        
      }
  
  

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


export const getOneUser = async (req, res) => {

  try {

    //  let users;

    // if (req.user.role === "restaurentadmin") {
    //   users = await getUsers(req.user.restaurents, req.user.id);
    // } else if (req.user.role === "superadmin" || req.user.role === "employee") {
    //   users = await getallUsers();

    //   // If the logged-in user is an employee, filter users with role "customer"
    //   if (req.user.role === "employee") {
    //     users = users.filter(user => user.role === "customer");
    //   }
    // }
    
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const updateOneUser = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};



export const deleteOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.user.role === "customer" && req.user.role !== "restaurentadmin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  
    const user = await deleteUser(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export const changePassword = async (req, res) => {
  console.log(req.user.id)
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if ( !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId, oldPassword, newPassword, and confirmPassword",
    });
  }

  try {
    const user = await GetUserPassword(req.user.id);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    console.log("Retrieved user from database:", user);

    const storedPassword = user || null;

    if (!storedPassword) {
      return res.status(500).json({
        success: false,
        message: "User password not found in the database",
      });
    }
    console.log(user);

    const validPassword = await bcrypt.compare(oldPassword, storedPassword);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(req.user.id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};














