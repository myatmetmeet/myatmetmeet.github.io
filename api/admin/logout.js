const {clearSession}=require("../_lib");
module.exports=async function(req,res){if(req.method!=="POST")return res.status(405).end();clearSession(res);return res.status(200).json({ok:true})};
