const {validSession}=require("../_lib");
module.exports=async function(req,res){return res.status(200).json({authenticated:validSession(req)})};
