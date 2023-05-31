const {URL}=require("../models/urlModel")
const validUrl = require('valid-url');
const shortid = require('shortid');
const{isValid}=require("../utils/index")
// urlCode,shortUrl


//POST /url/shorten
const shorten=async(req,res)=>{
    try {     
        const {longUrl}=req.body
    if(!isValid(longUrl)) return res.status(400).send({status:false,message:"longUrl must in form of string"})
    if (validUrl.isUri(longUrl)){
     let dataUrl=await URL.findOne({longUrl:longUrl})
     if(dataUrl) return res.status(200).send({status:false,message:"AlReady longUrl Preset",data:dataUrl})
    
                let urlcode=shortid.generate(longUrl)
                let surl="http://localhost:3000"
                let shortUrl=`${surl}/${urlcode}`
                let data=await URL.create({longUrl:longUrl,urlCode:urlcode,shortUrl:shortUrl})   
                res.status(200).send({status:true , message:"Blogs list",data:data})
            } else {
                return res.status(400).send({status:false,message:"Not a  valid URI "})
            }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

//GET /:urlCode
const getURL=async(req,res)=>{
try {
    let paramData=req.params
        const urlCode=await URL.findOne(paramData)
        console.log(urlCode)
        if(!urlCode) return res.status(200).send({status:false , message:"urlcode Not in Database",data:urlCode})
        longurl=urlCode.longUrl
        return res.redirect(urlCode.longUrl);

} catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}}


module.exports={shorten,getURL}