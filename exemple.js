/**
 * Lomadee API interface for Node.js
 * 
 * @author André Ferreira <andrehrf@gmail.com>
 * @see http://developer.buscape.com.br/portal/developer/tutoriais/criando-sua-conta-na-lomadee.html (Create account)
 * @see http://developer.buscape.com.br/portal/developer/tutoriais/gerando-seu-source-id.html (Generate sourceid)
 * @see http://developer.buscape.com.br/portal/developer/tutoriais/criando-seu-app-token.html (Generate token)
 */

"use strict";

let Lomadee = require("./index.js"),
    lomadee = new Lomadee("token", "sourceid");
    
lomadee.categories({}, (err, results) => {
    console.log(results);
});

lomadee.programs((err, results) => {
    console.log(results);
});

lomadee.offers({}, (err, results) => {
    console.log(results);
});

lomadee.product({}, (err, results) => {
    console.log(results);
});

lomadee.coupons({results: 100}, (err, results) => {
    console.log(results);
});

lomadee.report("user", "pass", {startDate: '27052016', endDate: '16072016', eventStatus: 0, publisherId: 'your publisher id'}, (err, results) => {
    if(err)
        console.log(err);
    else
        console.log(results);
});

lomadee.deeplink("http://www.submarino.com.br/", (err, url) => {
    console.log(url); //http://links.lomadee.com/ls/T1k5YTtyR0hYZWxPTDszNTcwMTM4ODswOzk1MjswOzU3NjY7QlI7MztodHRwJTNBJTJGJTJGd3d3LnN1Ym1hcmluby5jb20uYnIlMkY7MDsw.html
});
