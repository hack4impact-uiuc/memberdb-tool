const express = require('express');
const router = express.Router();
const Member = require('./../models/member');
const { errorWrap } = require('../middleware');

router.get(
  '/',
  errorWrap(async (req, res) => {
    Member.find({}, (err, members) => {
        const condensedMembers = [];

        if (members)
          members.forEach(member => {
              curMember = {};
              curMember.firstName = member.firstName;
              curMember.lastName = member.lastName;
              curMember.email = member.email;
              curMember.netID = member.netID;
              curMember.phone = member.phone;
              curMember.major = member.major; 
              curMember.birthdate = member.birthdate;
              curMember.github = member.github; 
              curMember.snapchat = member.snapchat;
              curMember.instagram = member.instagram;

              condensedMembers.push(curMember);
          })

        res.status(200).json({
            success: true,
            result: condensedMembers
        })
    })
  }),
);

module.exports = router;
