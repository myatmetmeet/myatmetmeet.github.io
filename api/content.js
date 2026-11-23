const {admin,db}=require("./_lib");
module.exports=async function(req,res){try{
 if(req.method==="GET"){const privateView=req.query?.includeDrafts==="1";if(privateView&&!admin(req,res))return;const filter=privateView?"select=*":"select=id,category,type,title,body,image_url,status,created_at&status=eq.published";const rows=await db("site_content?"+filter+"&order=created_at.desc");return res.status(200).json(rows||[])}
 if(!admin(req,res))return;
 if(req.method==="POST"||req.method==="PUT"){const x=req.body||{};if(!x.title||!x.category||!["world","character","canon","extra"].includes(x.category)||!["draft","published"].includes(x.status))return res.status(400).json({error:"입력값을 확인해 주세요."});
 const row={category:x.category,type:x.type||"",title:x.title,body:x.body||"",image_url:x.image_url||null,status:x.status,updated_at:new Date().toISOString()};
 if(req.method==="POST"){const out=await db("site_content",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(row)});return res.status(201).json(out[0])}
 if(!x.id)return res.status(400).json({error:"기록 ID가 필요합니다."});const out=await db("site_content?id=eq."+encodeURIComponent(x.id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(row)});return res.status(200).json(out[0]||{id:x.id})}
 if(req.method==="DELETE"){const id=req.body?.id;if(!id)return res.status(400).json({error:"기록 ID가 필요합니다."});await db("site_content?id=eq."+encodeURIComponent(id),{method:"DELETE"});return res.status(200).json({ok:true})}
 return res.status(405).end();
 }catch(e){return res.status(500).json({error:e.message})}};
