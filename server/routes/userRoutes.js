import express from "express";
import { isAdminRoute, protectRoute,isSupRoute } from "../middleware/authMiddleware.js";
import { loginUser,getUser, getInactiveList,getAllUserHistory,adminDashboard,getAllSupInt, getAllIntSup , deleteRestoreUser,registerUser , getAllUser,logOutUser,getTeamList, getNotificationsList,updateUserProfile,markNotificationRead,changeUserPassword,activateUserProfile,deleteUserProfile, getAllUserSup, adminChangeUserPassword} from "../controllers/userController.js";

const router = express.Router()

router.post("/register",registerUser);
router.post("/login",loginUser)
router.post("/logout",logOutUser)

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/get-inactive", protectRoute, isAdminRoute, getInactiveList);
router.get("/notifications", protectRoute, getNotificationsList);
router.get("/",protectRoute, isAdminRoute, getAllUser)
router.get("/history",protectRoute, isAdminRoute, getAllUserHistory)
router.get("/find/:id",protectRoute, getUser)
router.get("/suplist",protectRoute, isAdminRoute, getAllUserSup)
router.get("/int-sup",protectRoute, getAllIntSup)
router.get("/sup-int",protectRoute, getAllSupInt)
router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);
router.put("/admchangepassword", protectRoute, adminChangeUserPassword);
router.get("/admindash",protectRoute,isAdminRoute,adminDashboard)
// //   FOR ADMIN ONLY - ADMIN ROUTES
router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreUser
);
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router