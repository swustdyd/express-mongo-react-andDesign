/**
 * Created by Aaron on 2018/4/18.
 */
const express = require('express');
const router = express.Router();
const DefaultPageSize = require('../common/commonSetting').queryDefaultOptions.pageSize;

/**
 * 对http请求进行过滤
 * @param req
 * @param res
 * @param next
 */
router.use((req, res, next) => {
    req.query.pageIndex = 0;
    if (req.query.pageIndex) {
        req.query.pageIndex = /^[0-9]+$/.test(req.query.pageIndex) ? parseInt(req.query.pageIndex) : 0;
    }
    if (req.query.pageSize) {
        req.query.pageSize = /^[1-9][0-9]*$/.test(req.query.pageSize)
            ? Math.min(parseInt(req.query.pageSize), DefaultPageSize) : DefaultPageSize;
    }
    next();
})

module.exports = router;