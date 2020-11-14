function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}
then

var json_obj = JSON.parse(Get(yourUrl));
console.log("this is the author name: "+json_obj.author_name);