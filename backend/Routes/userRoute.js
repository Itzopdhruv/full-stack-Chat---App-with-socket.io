import express from "express";
import {
  allUsers,
  login,
  logout,
  signup,
} from "../Controllers/userController.js";
import upload from "../MiddleWares/multer.js";
import secureRoute from "../MiddleWares/secureRoute.js";
const router = express.Router();

router.post("/signup", upload.single('photo'), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/allusers", secureRoute, allUsers);

export default router;