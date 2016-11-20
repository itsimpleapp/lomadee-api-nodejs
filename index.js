"use strict";

const url = require("url"),
      request = require("request"),
      xml2json = require('xml2json-light');

module.exports = function(token, sourceid){
    return {
        /**
         * Function to generate the API request
         *
         * @param string URL 
         * @param function cb
         */
        getinapi: function(URL, XmlToJSON, cb) {            
            request(URL, (error, response, body) => { 
                if(body)
                    if(XmlToJSON)
                        body = xml2json.xml2json(body).result;
                    else
                        body = JSON.parse(body);
                
                cb(error, body); 
            });
        },
        
        /**
         * Function to generate application link
         *
         * @see http://stackoverflow.com/questions/22678346/convert-javascript-object-to-url-parameters
         * @param string URLbase
         * @param object params
         * @return string
         */
        createurl: function(URLbase, params) {
            let paramsStr = Object.keys(params).map(function(k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
            }).join('&');

            return URLbase + ((URLbase.indexOf("?") >= 0) ? "" : "?") + paramsStr;
        },
        
        /**
         * Function to encode URL
         * 
         * @see http://locutus.io/php/url/urlencode/
         * @param str
         * @return str
         */
        urlencode: function(str){
            str = (str + '');
            return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+')
        },
        
        /**
         * Get categories list
         *
         * @see http://developer.buscape.com.br/portal/developer/documentacao/apis-afiliados/api-lomadee/api-de-ofertas/#2C9EF4C95334181D0153352D59D8088B
         * @param object params
         * categoryId: ID Category
         * keyword: Keyword
         * results: Number of results per page
         * page: Page Number
         * @param function cb
         */
        categories: function(params, cb) {
            params.sourceId = sourceid;
            params.format = "json";
            
            let URL = this.createurl("http://bws.buscape.com.br/service/findCategoryList/lomadee/" + token + "/BR", params);
            this.getinapi(URL, false, cb);
        },
        
        /**
         * Get advertiser programs
         *
         * @see http://developer.buscape.com.br/portal/developer/documentacao/apis-afiliados/api-lomadee/api-de-ofertas/#2C9EF4C95334181D0153353316D523A9
         * @param function cb
         */
        programs: function(cb) {
            let URL = this.createurl("http://bws.buscape.com.br/service/sellers/lomadee/" + token + "/BR", {format: "json", sourceId: sourceid});
            this.getinapi(URL, false, cb);
        },
        
        /**
         * Get offers
         * 
         * @see http://developer.buscape.com.br/portal/developer/documentacao/apis-afiliados/api-lomadee/api-de-ofertas/#2C9EF4C95334181D01533530FD4B1C75
         * @param object params
         * categoryId: ID Category
         * productId: Product ID
         * barcode: Bar Code
         * results: Number of results per page
         * page: Page Number
         * priceMin: Minimum price offers
         * priceMax: Maximum price offers
         * offerId: Offer ID in Buscapé
         * allowedSellers: List stores IDs separated by ,
         * @param function cb
         */
        offers: function(params, cb){
            params.sourceId = sourceid;
            params.format = "json";
            
            let URL = this.createurl("http://bws.buscape.com.br/service/findOfferList/lomadee/" + token + "/BR", params);
            this.getinapi(URL, false, cb);
        },
        
        /**
         * Get products, including their tracking links
         * 
         * @see http://developer.buscape.com.br/portal/developer/documentacao/apis-afiliados/api-lomadee/api-de-ofertas/#2C9EF4C95334181D0153352EC2260F4A
         * @param object params
         * categoryId: ID Category
         * keyword: Keyword
         * results: Number of results per page
         * page: Page Number
         * priceMin: Minimum price offers
         * priceMax: Maximum price offers
         * offerId: Offer ID in Buscapé
         * @param function cb
         */
        product: function(params, cb){
            params.sourceId = sourceid;
            params.format = "json";
            
            let URL = this.createurl("http://bws.buscape.com.br/service/findProductList/lomadee/" + token + "/BR", params);
            this.getinapi(URL, false, cb);
        },
        
        /**
         * Get coupons, including their tracking links
         * 
         * @see http://developer.buscape.com.br/portal/developer/documentacao/apis-afiliados/api-lomadee/api-de-cupons/
         * @param object params
         * categoryId: ID Category
         * keyword: Keyword
         * results: Number of results per page
         * page: Page Number
         * @param function cb
         */
        coupons: function(params, cb){
            params.sourceId = sourceid;
            params.format = "json";
            
            let URL = this.createurl("http://bws.buscape.com/service/coupons/lomadee/" + token + "/", params);
            this.getinapi(URL, false, cb);
        },
        
        /**
         * Returns basic statistics of clicks, views, leads and sales
         * 
         * @see http://developer.buscape.com.br/portal/developer/documentacao/apis-afiliados/api-lomadee/api-de-relatorios/
         * @param string user E-mail access in Lomadee
         * @param string pass Password access in Lomadee
         * @param object params 
         * startDate: Query start date in ddMMaaaa format
         * endDate: Query end date in ddMMaaaa format
         * eventStatus: Status of Transactions: 0 - Pending 1 - Confirmed, 2 - Cancelled, 99 - Bonus
         * publisherId: Publisher ID you want to view the report
         * @param function cb
         */
        report: function(user, pass, params, cb){
            request("http://sbws.buscape.com.br/api/lomadee/createToken?user="+user+"&password="+pass, (error, response, body) => { 
                if(error){
                    cb(error, null);
                }
                else{
                    var auth = JSON.parse(body);
                    params.format = "json";
                    let URL = this.createurl("http://bws.buscape.com.br/api/lomadee/reportTransaction/" + auth.token, params);
                    this.getinapi(URL, true, cb);
                }
            });
        },
        
        /**
         * Create tracking links
         * 
         * @param string url
         * @param integer adspace
         * @return void
         */
        deeplink: function(url, cb){
            request("http://bws.buscape.com/service/createLinks/lomadee/3651516a44624e526551453d/?sourceId="+sourceid+"&format=json&link1=" + this.urlencode(url), (error, response, body) => { 
                if(error){
                    cb(error, null);
                }
                else{
                    var resp = JSON.parse(body);
                    
                    if(typeof cb == "function"){
                        if (resp == null)
                            cb({"msg": "Error connecting to Lomadee."}, "");      
                        else if (resp.lomadeelinks[0].lomadeelink.code == 0)	
                            cb(false, resp.lomadeelinks[0].lomadeelink.redirectlink);  
                        else if (resp.details.code == 501)
                            cb({"msg": "Invalid SourceId."}, "");                         
                        else
                            cb({"msg": "Invalid link to this program."}, "");  
                    }
                }
            });
        }
    }
}
