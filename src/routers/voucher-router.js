const router = require('express').Router();
const VoucherController = require('../controllers/voucher-controller');

router.post('/voucher/create', VoucherController.createVoucher);

router.patch('/voucher/update/:id', VoucherController.updateVoucher);

router.delete('/voucher/delete/:id', VoucherController.deleteVoucher);

router.get('/voucher/list', VoucherController.getListVoucher);

// router.get('/voucher/detail/:id', VoucherController.getDetailVoucher);

module.exports = router;