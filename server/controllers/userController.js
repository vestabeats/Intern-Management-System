import Notice from "../models/notification.js"
import User from "../models/user.js"
import { createJWT } from "../utils/index.js"

export const registerUser =async(req,res)=>{
    try{
        const {surname,firstname,dob,phonenumber,email,department,password,isAdmin,role,startdate,enddate,supervisor,isActive,theme} = req.body
        const userExist = await User.findOne({email})
       
        if(userExist){
            
        return res.status(400).json({status:false, message:"user already exists"})
        }
        let isSup
        if(role=="supervisor"){
            isSup=true
        }else{
            isSup=false
        }
        const user =  await User.create({
            surname,firstname,dob,phonenumber,email,department,password,isAdmin,role,startdate,enddate,isSup,supervisor,isActive,theme
        })
        if(user){
            isAdmin ? createJWT(res,user._id):null
            user.password = undefined
            res.status(201).json(user)
        }else{
            res.status(400).json({status:false, message:"invalid user data"})
        }

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }
}

export const loginUser =async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            
            return res.status(401).json({status:false, message:"invalid email or password"})
            }
        if(!user?.isActive){
        
            return res.status(401).json({status:false, message:"user account has been deactivated, contact the administration"})
        }
        const isMatch = await user.matchPassword(password)
        if(user && isMatch){
            createJWT(res,user._id)
            user.password = undefined

            res.status(200).json(user)
        }else{
            return res.status(401).json({status:false, message:"invalid password"})
        }

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }
}

export const logOutUser=async(req,res)=>{
    try{
        res.cookie("token","",{
            httpOnly:true,
            expiresIn:new Date(0),
           
        })
        return res.status(200).json({ status: true, message: "Logout successful" });

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }
}

export const getTeamList=async(req,res)=>{
    try{
        const users = await User.find().select("name title role email isActive");
        res.status(200).json(users)

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }
}
export const getInactiveList=async(req,res)=>{
  const {search}=req.query
  try{
   
    const fil={isActive:false,isTrashed:false}
    if (search !== '') {
      // Use a logical OR operator to search by either surname or firstname
      fil.$or = [
          { surname: { $regex: search, $options: 'i' } },
          { firstname: { $regex: search, $options: 'i' } }
      ];
  }
      const users = await User.find(fil).select("surname firstname role department isActive");
      res.status(200).json(users)

  }catch(error){
      console.log(error)
      return res.status(400).json({status:false, message:error.message})
  }
}
export const getAllUser = async (req, res) => {
  try {
      const { role, isTrashed, search } = req.query;
      const fil = { };
      if(isTrashed===true||isTrashed==="true"){
       fil.isTrashed=isTrashed;
      }else{
        fil.isTrashed=isTrashed;
        fil.isActive=true
      }
      if (role) {
          fil.role = role;
      }

      if (search !== '') {
          // Use a logical OR operator to search by either surname or firstname
          fil.$or = [
              { surname: { $regex: search, $options: 'i' } },
              { firstname: { $regex: search, $options: 'i' } }
          ];
      }

      const users = await User.find(fil).populate('supervisor', 'surname');
      res.status(200).json(users);
  } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
  }
};
export const getAllUserHistory = async (req, res) => {
  try {
    const { start, end,search } = req.query;
    const fil = { isAdmin: false, isSup: false };
    if (search !== '') {
      // Use a logical OR operator to search by either surname or firstname
      fil.$or = [
          { surname: { $regex: search, $options: 'i' } },
          { firstname: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } }
      ];
  }


    // Helper function to validate year input
    const isValidYear = (year) => /^\d{4}$/.test(year);

    // Parse and validate the start and end years from the query parameters
    const startYear = start && isValidYear(start) ? parseInt(start, 10) : null;
    const endYear = end && isValidYear(end) ? parseInt(end, 10) : null;

    // Return error if years are invalid
    if ((start && !isValidYear(start)) || (end && !isValidYear(end))) {
      return res.status(400).json({ status: false, message: 'Invalid year format. Please provide a valid four-digit year.' });
    }

    // Initialize filter conditions array
    let filterConditions = [];

    // Handle the case where both startYear and endYear are provided
    if (startYear !== null && endYear !== null) {
      // Define the start and end dates for the specified years
      const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${endYear}-12-31T23:59:59.999Z`);

      // Push the filter conditions for start and end dates
      filterConditions.push({
        startdate: { $gte: startDate, $lte: endDate },
        enddate: { $gte: startDate, $lte: endDate }
      });

      console.log(`Filtering users with start date ${startDate} and end date ${endDate}`);
    } else {
      // Handle cases where only startYear or endYear is provided
      if (startYear !== null) {
        const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${startYear}-12-31T23:59:59.999Z`);
        filterConditions.push({ startdate: { $gte: startDate, $lte: endDate } });
        console.log(`Filtering users for the year ${startYear}`);
      }
      if (endYear !== null) {
        const startDate = new Date(`${endYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${endYear}-12-31T23:59:59.999Z`);
        filterConditions.push({ enddate: { $gte: startDate, $lte: endDate } });
        console.log(`Filtering users for the year ${endYear}`);
      }
    }

    // Combine the conditions into an $and array if both startYear and endYear are provided
    if (filterConditions.length > 0) {
      fil.$and = filterConditions;
    }

    console.log('Final filter:', JSON.stringify(fil, null, 2));

    const users = await User.find(fil).populate('supervisor', 'surname');
    res.status(200).json(users);
  } catch (error) {
    console.log('Error:', error);
    return res.status(400).json({ status: false, message: error.message });
  }
};





export const getAllUserSup = async (req, res) => {
    try {
        const { role,search } = req.query;
        const fil = { isTrashed:false ,isActive:true};
        if(role){
            fil.role=role
        }
       
        const users = await User.find(fil).populate('supervisor', ' surname');;
        
       
         return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
};
export const getAllSupInt=async(req, res)=>{
  try{
    const {userId} = req.user
    const user = await User.findById(userId).populate({path:'supervisor', select:' surname firstname email phonenumber department role'});
      
    return res.status(200).json(user);

  }catch(error){
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }

}
export const getAllIntSup = async (req, res) => {
  const{userId}=req.query
  console.log("userId",userId)
  try {
     //const {userId} = req.user
     
     
      const users = await User.find({supervisor:userId})
      
     
      res.status(200).json(users);
  } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
  }
};
export const getUser=async(req,res)=>{
  const {id}=req.params
  try{
    const user = await User.findById(id)
    res.status(200).json(user)

  }catch(error){
    res.status(400).json({status:false,message:error.message})
  }
}



export const getNotificationsList=async(req,res)=>{
    try{
        const {userId} = req.user
        const notice = await Notice.find({
            team:userId,
            isRead:{$nin:[userId]}
        }).populate("task", "title")
        res.status(200).json(notice)

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }
}

export const updateUserProfile=async(req,res)=>{
    try{
        const {userId, isAdmin} = req.user
        const {_id}=req.body
      
        const id =isAdmin && userId === _id? userId: isAdmin && userId !== _id? _id: userId;
        const user = await User.findById(id)
     
        if(user){
            user.surname= req.body.surname ||  user.surname
            user.firstname = req.body.firstname || user.firstname;
            user.role = req.body.role || user.role;
            user.supervisor = req.body.supervisor || user.supervisor;
            user.email = req.body.email || user.email;
            user.startdate = req.body.statdate || user.startdate;
            user.dob = req.body.dob || user.dob;
            user.enddate = req.body.enddate || user.enddate;
            user.theme = req.body.theme || user.theme;
            user.department = req.body.department || user.department;
            user.phonenumber = req.body.phonenumber || user.phonenumber;
            const updatedUser = await user.save();
           console.log(updatedUser)
            user.password = undefined;
      
            res.status(201).json({
              status: true,
              message: "Profile Updated Successfully.",
              user: updatedUser,
            });
          } else {
            res.status(404).json({ status: false, message: "User not found" });
          }

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }

}

export const markNotificationRead=async(req,res)=>{
    try{
        const{userId}= req.user
        const {isReadType,id}= req.query
        if(isReadType==="all"){
            await Notice.updateMany({team:userId,isRead:{$nin:[userId]}},{$push:{isRead:userId}},{new:true})
        }
        else {
            await Notice.findOneAndUpdate(
              { _id: id, isRead: { $nin: [userId] } },
              { $push: { isRead: userId } },
              { new: true }
            );
          }
      
          res.status(201).json({ status: true, message: "Done" });

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }

}

export const adminChangeUserPassword=async(req,res)=>{
  const { userId } = req.query;
  try{
      

  const user = await User.findById(userId);

  if (user) {
    user.password = req.body.password;

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: true,
      message: `Password changed successfully.`,
    });
  } else {
    res.status(404).json({ status: false, message: "User not found" });
  }

  }catch(error){
      console.log(error)
      return res.status(400).json({status:false, message:error.message})
  }

}
export const changeUserPassword=async(req,res)=>{
    try{
        const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password chnaged successfully.`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }

    }catch(error){
        console.log(error)
        return res.status(400).json({status:false, message:error.message})
    }

}

export const activateUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id);
  
      if (user) {
        user.isActive = req.body.isActive; //!user.isActive
  
        await user.save();
  
        res.status(201).json({
          status: true,
          message: `User account has been ${
            user?.isActive ? "activated" : "disabled"
          }`,
        });
      } else {
        res.status(404).json({ status: false, message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const deleteUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id);
      user.isTrashed = true
      await user.save()
  
      res
        .status(200)
        .json({ status: true, message: "User trashed successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  export const deleteRestoreUser =async(req,res)=>{
    try{
        const { id } = req.params;
        const { actionType } = req.query;
    
        if (actionType === "delete") {
          await User.findByIdAndDelete(id);
        } else if (actionType === "deleteAll") {
          await User.deleteMany({ isTrashed: true });
        } else if (actionType === "restore") {
          const resp = await User.findById(id);
    
          resp.isTrashed = false;
          resp.save();
        } else if (actionType === "restoreAll") {
          await User.updateMany(
            { isTrashed: true },
            { $set: { isTrashed: false } }
          );
        }
    
        res.status(200).json({
          status: true,
          message: `Operation performed successfully.`,
        });

    }catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
}
export const adminDashboard =async(req,res)=>{
    try{
        const{userId,isAdmin } = req.user
        const allUsers = isAdmin
        && await User.find({
            isTrashed: false,
            isActive:true
          })
            
       
        const groupUsers = allUsers.reduce((result, user) => {
            const role = user.role;
      
            if (!result[role]) {
              result[role] = 1;
            } else {
              result[role] += 1;
            }
      
            return result;
          }, {});
        // Group tasks by priority
    const groupData = Object.entries(
        allUsers.reduce((result, user) => {
          const { role } = user;
  
          result[role] = (result[role] || 0) + 1;
          return result;
        }, {})
      ).map(([name, total]) => ({ name, total }));
  
      // calculate total tasks
      const totalUsers = allUsers?.length;
      
  
      const summary = {
        totalUsers,
       users: groupUsers,
        graphData: groupData,
      };
  
      res.status(200).json({
        status: true,
        message: "Successfully",
        ...summary,
      });

    }catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
}

