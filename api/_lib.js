const crypto=require("crypto");
const COOKIE="enfpath_admin";
function secret(){return process.env.SESSION_SECRET||""}
function sign(value){return crypto.createHmac("sha256",secret()).update(value).digest("hex")}
function cookieValue(req){const raw=req.headers.cookie||"";const part=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));return part?decodeURIComponent(part.slice(COOKIE.length+1)):""}
function validSession(req){if(!secret())return false;const token=cookieValue(req);const bits=token.split(".");if(bits.length!==2)return false;const [expires,sig]=bits;if(Number(expires)<Date.now())return false;const expected=sign(expires);return safeEqual(sig,expected)}
function safeEqual(a,b){const A=Buffer.from(String(a)),B=Buffer.from(String(b));return A.length===B.length&&crypto.timingSafeEqual(A,B)}
function setSession(res){const expires=String(Date.now()+1000*60*60*8);const token=expires+"."+sign(expires);res.setHeader("Set-Cookie",`${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`)}
function clearSession(res){res.setHeader("Set-Cookie",`${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`)}
function admin(req,res){if(!validSession(req)){res.status(401).json({error:"관리자 로그인이 필요합니다."});return false}return true}
function dbConfig(){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");return {url:url.replace(/\\/$/,""),key}}
async function db(path,options={}){const {url,key}=dbConfig();const r=await fetch(url+"/rest/v1/"+path,{...options,headers:{"apikey":key,"Authorization":"Bearer "+key,"Content-Type":"application/json",...(options.headers||{})}});const text=await r.text();if(!r.ok)throw new Error(text||"Database request failed");return text?JSON.parse(text):null}
module.exports={safeEqual,setSession,clearSession,admin,db,validSession};
