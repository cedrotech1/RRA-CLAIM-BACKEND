import express from 'express';
import {
  addCustomer,addAdmin,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  changePassword
} from '../controllers/userController';
import { protect } from '../middlewares/protect';
const router = express.Router();

router.post('/signup', addCustomer);
router.post('/add',protect, addAdmin);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getOneUser);
router.put('/update/:id', protect, updateOneUser);
router.delete('/delete/:id', protect, deleteOneUser);
// router.put('/activate/:id', protect, activateOneUser);
// router.put('/deactivate/:id', protect, deactivateOneUser);
router.put('/changePassword', protect, changePassword);
// router.post('/signup', addCustomer);


export default router;
