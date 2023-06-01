const urlModel=require('../models/urlModel')
const validURl=require('valid-url');
const shortId=require('shortid');


const getUrl=async (req,res)=>{
    let {urlCode}=  req.params
    let url = await urlModel.findOne({urlCode:urlCode})
    let resultant=url.longUrl
    return res.status(302).send({status:true,data:resultant})  
}
module.exports.getUrl=getUrl