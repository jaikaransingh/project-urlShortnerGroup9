const { URLMODEL } = require("../models/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");
const { isValid } = require("../utils/index");
// ===============================================================
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

//================================================================
// urlCode,shortUrl
//POST /url/shorten
const shorten = async (req, res) => {
  try {

    const { longUrl } = req.body;
    if (!isValid(longUrl))
      return res
        .status(400)
        .send({ status: false, message: "longUrl must in form of string" });
    if (validUrl.isUri(longUrl)) {
      let dataUrl = await URLMODEL.findOne({ longUrl: longUrl }).select({urlCode:1,shortUrl:1,longUrl:1});
    

      if (dataUrl){
        //====================================
        let catchWrite = myCache.set( "urlcode",dataUrl);
        let getData = myCache.get( "urlcode" );
        // if(getData.longUrl==longUrl)return res.send(getData.shortUrl)
        // console.log(getData)
        //====================================
        return res
          .status(200)
          .send({
            status: false,
            message: "AlReady longUrl Preset",
            urls:dataUrl,
          });}
          console.log(dataUrl)

        //  myCache.set( "urlcode",dataUrl);
        // let value = myCache.get( "urlcode" );
        //  console.log(value)

      let urlcode = shortid.generate(longUrl);
      let surl = "http://localhost:3000";
      let shortUrl = `${surl}/${urlcode}`;
      //=======================================


//=============================================


      let data = await URLMODEL.create({
        longUrl: longUrl,
        urlCode: urlcode,
        shortUrl: shortUrl,
      });

    


      // await client.set({longUrl:longUrl,urlCode:urlcode,shortUrl:shortUrl});
      res.status(200).send({ status: true, message: "Blogs list", data: data });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Not a  valid URI " });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//GET /:urlCode
const getURL = async (req, res) => {
  try {
 let paramData = req.params;
    console.log(paramData)

    const urlCode = await URLMODEL.findOne(paramData);
    if(urlCode){  
      let getDat = myCache.get( "urlcode" );
      console.log(getDat)
      
      
      let setCache = myCache.set( "urlcodeData",urlCode );
    let getData = myCache.get( "urlcodeData" );
    if(urlCode.longUrl==getData.longUrl)return res.redirect(getData.longUrl)
    // console.log(getData)
  }
    if (!urlCode)
      return res
        .status(200)
        .send({
          status: false,
          message: "urlcode Not in Database",
          data: urlCode,
        });
    longurl = urlCode.longUrl;
    // myCache.
    return res.redirect(urlCode.longUrl);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { shorten, getURL };
