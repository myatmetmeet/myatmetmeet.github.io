const {admin}=require("./_lib");
module.exports=async function(req,res){if(req.method!=="POST")return res.status(405).end();if(!admin(req,res))return;try{
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY,bucket=process.env.SUPABASE_STORAGE_BUCKET||"enfpath-media";
 if(!url||!key)return res.status(500).json({error:"Supabase 환경 변수가 설정되지 않았습니다."});
 const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);if(!body.length)return res.status(400).json({error:"업로드할 파일이 없습니다."});if(body.length>8*1024*1024)return res.status(413).json({error:"이미지는 8MB 이하로 올려 주세요."});
 const type=req.headers["content-type"]||"application/octet-stream";if(!type.startsWith("image/"))return res.status(400).json({error:"이미지 파일만 업로드할 수 있습니다."});
 const raw=decodeURIComponent(req.headers["x-file-name"]||"image");const ext=(raw.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");const name=Date.now()+"-"+require("crypto").randomBytes(5).toString("hex")+"."+ext;
 const upload=await fetch(url.replace(/\\/$/,"")+"/storage/v1/object/"+bucket+"/"+name,{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":type,"x-upsert":"false"},body});
 if(!upload.ok)throw new Error(await upload.text());return res.status(200).json({url:url.replace(/\\/$/,"")+"/storage/v1/object/public/"+bucket+"/"+name});
 }catch(e){return res.status(500).json({error:e.message})}};
