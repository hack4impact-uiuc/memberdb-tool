const express = require('express');
const router = express.Router();
const member = require('./../models/member');
const { errorWrap } = require('../middleware');

router.get(
  '/members',
  errorWrap(async (req, res) => {
    member.find({}, (err, members) => {
        const condensedMembers = [];
        members.forEach(member => {
            curMember = {};
            curMember.firstName = member.firstName;
            curMember.lastName = member.lastName;
            curMember.email = member.email;
            curMember.netID = member.netID;
            // TODO: Determine fields needed for frontend.
        })

        res.status(200).json({
            success: true,
            result: condensedMembers
        })
    })
  }),
);

module.exports = router;
