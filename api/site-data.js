const { list } = require("@vercel/blob");
const defaults = require("../lib/defaults");
module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  try{
    const result=await list({prefix:"kalro-farm/site-data.json",limit:1});
    if(result.blobs&&result.blobs.length){
      const response=await fetch(result.blobs[0].url,{cache:"no-store"});
      if(response.ok){const data=await response.json();return res.status(200).json(data);}
    }
  }catch(error){console.error("Could not load farm data from Blob",error);}
  return res.status(200).json(defaults);
};