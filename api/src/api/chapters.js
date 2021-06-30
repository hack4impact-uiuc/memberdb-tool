const { body, validationResult, param} = require("express-validator");
const express = require('express');
const Chapter = require('../models/chapters');
const errorWrap = require('../middleware/errorWrap');
const { requireAdmin } = require("../middleware/auth");
const router = express.Router();

function validationMiddleware(mode) {
    const allValidations = [
        body("email").if(body("email").exists()).isEmail(),
        body("name").if(body("name").exists()).notEmpty(),
        body("website").if(body("website").exists()).isURL(),
        body("linkedin").if(body("linkedin").exists()).isURL(),
        body("github").if(body("github").exists()).isURL(),
        body("notion").if(body("notion").exists()).isURL(),
        body("leaders").if(body("leaders").exists()).isArray()
    ]

    const validationCollector = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } else next()
    }

    switch (mode) {
        case "UPDATE":
            return [
                param("id").exists().isMongoId(),
                ...allValidations,
                validationCollector
            ];
        case "CREATE":
            return [
                body("email").exists(),
                body("name").exists(),
                body("leaders").exists(),
                ...allValidations,
                validationCollector
            ];
        case "DELETE":
            return [
                param("id").exists().isMongoId(),
                validationCollector
            ];
        default:
            throw new Error("Incorrect mode passed into validation middleware for Chapters. Please pass in: 'CREATE', 'UPDATE', or 'DELETE'.")
    }

}

router.post("/",
    validationMiddleware("CREATE"),
    requireAdmin,
    errorWrap(async (req, res) => {
        const newChapter = new Chapter(req.body);
        await newChapter.save();
        res.status(200).json({
            success: true,
            result: newChapter.toObject,
            message: "New chapter added."
        })
    }),
    (req, res) => res.end()
)

router.put("/:id", 
    validationMiddleware("UPDATE"),
    requireAdmin,
    errorWrap(async (req, res) => {
        let chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (chapter) {
            res.status(200).json({
                success: true,
                result: chapter.toObject,
                message: "Chapter modfied"
            })
        } else res.status(400).json({
            success: false,
            message: "Chapter not found"
        })
    })
)

module.exports = router;
