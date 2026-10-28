const crypto=require("crypto");
const {list,put}=require("@vercel/blob");
const defaults=require("../lib/defaults");
const COOKIE="kalro_admin";
function sign(value){return crypto.createHmac("sha256",process.env.ADMIN_SESSION_SECRET||"missing-secret").update(value).digest("hex")}
function safeEqual(a,b){const x=Buffer.from(String(a||"")),y=Buffer.from(String(b||""));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function cookieValue(req){const raw=req.headers.cookie||"";const part=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));return part?decodeURIComponent(part.slice(COOKIE.length+1)):""}
function validSession(req){const value=cookieValue(req).split(".");if(value.length!==2)return false;const expiry=value[0];if(!/^\d+$/.test(expiry)||Number(expiry)<Date.now())return false;return safeEqual(value[1],sign(expiry))}
function setCookie(res,value,maxAge){res.setHeader("Set-Cookie",COOKIE+"="+encodeURIComponent(value)+"; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age="+maxAge)}
async function readData(){const result=await list({prefix:"kalro-farm/site-data.json",limit:1});if(result.blobs&&result.blobs.length){const r=await fetch(result.blobs[0].url,{cache:"no-store"});if(r.ok)return await r.json()}return JSON.parse(JSON.stringify(defaults))}
async function writeData(data){const safe={settings:data.settings||defaults.settings,livestock:Array.isArray(data.livestock)?data.livestock:defaults.livestock,products:Array.isArray(data.products)?data.products.filter(item=>!["dairy-meal-50kg","dairy-meal-70kg","layers-mash","growers-mash","chick-mash","fish-feed-50kg","dog-meal-20kg","organic-fertilizer","hybrid-maize-seeds","napier-grass-seeds"].includes(item.id)):defaults.products,photos:data.photos&&typeof data.photos==="object"?data.photos:{}};await put("kalro-farm/site-data.json",JSON.stringify(safe),{access:"public",addRandomSuffix:false,allowOverwrite:true,contentType:"application/json",cacheControlMaxAge:60});return safe}
module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  if(req.method==="GET"){if(!validSession(req))return res.status(401).json({error:"Please sign in"});try{return res.status(200).json(await readData())}catch(e){console.error(e);return res.status(500).json({error:"Unable to load saved website data. Check Blob storage configuration."})}}
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  let body=req.body;if(typeof body==="string"){try{body=JSON.parse(body)}catch{return res.status(400).json({error:"Invalid JSON"})}}body=body||{};
  try{
    if(body.action==="login"){
      if(!process.env.ADMIN_PASSWORD||!process.env.ADMIN_SESSION_SECRET)return res.status(503).json({error:"Admin credentials are not configured in Vercel."});
      if(!safeEqual(body.password,process.env.ADMIN_PASSWORD))return res.status(401).json({error:"Incorrect password."});
      const expiry=String(Date.now()+8*60*60*1000);setCookie(res,expiry+"."+sign(expiry),8*60*60);return res.status(200).json({ok:true,data:await readData()});
    }
    if(body.action==="logout"){setCookie(res,"",0);return res.status(200).json({ok:true})}
    if(!validSession(req))return res.status(401).json({error:"Your session expired. Please sign in again."});
    if(body.action==="save"){const saved=await writeData(body.data||{});return res.status(200).json({ok:true,data:saved})}
    if(body.action==="upload"){
      const match=String(body.dataUrl||"").match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
      if(!match)return res.status(400).json({error:"Unsupported image format. Use JPG, PNG, WEBP or GIF."});
      const buffer=Buffer.from(match[2],"base64");if(buffer.length>4*1024*1024)return res.status(413).json({error:"Image must be smaller than 4 MB."});
      const name=String(body.fileName||"farm-photo").replace(/[^a-zA-Z0-9._-]/g,"-").slice(-80);
      const blob=await put("kalro-farm/photos/"+Date.now()+"-"+name,buffer,{access:"public",addRandomSuffix:true,contentType:match[1]});
      return res.status(200).json({ok:true,url:blob.url});
    }
    return res.status(400).json({error:"Unknown action"});
  }catch(error){console.error("KALRO admin API error",error);return res.status(500).json({error:"Could not save changes. Please try again or check Vercel Blob storage."})}
};