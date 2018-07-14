const express=require('express')
const path=require('path')
const studntRounter=express.Router()
const studentControlPath=require(path.join(__dirname,"../controllers/studentControl"))

studntRounter.get("/list",studentControlPath.getListPage)

module.exports=studntRounter;