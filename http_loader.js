
var HttpLoader = {};

HttpLoader.createRequestObject = function()
{
    try{
        return new XMLHttpRequest();
    }
    catch(e){}
    try{
        return new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e){}
    
    try{
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch(e){}
    return null;
};

HttpLoader.encodeKeyValue = function(obj)
{
    var str = "";
    for(var key in obj){
        if(str != ""){
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
};

HttpLoader.loadText = function(url, func, method, reqstr)
{
    var xhr = HttpLoader.createRequestObject(url);
    if(!xhr){return null;}

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){ //complete
            if(xhr.status == 200){ //succeeded
                func(xhr.responseText);
            }
            else{ //failed.
                func(null);
            }
        }
    };
    xhr.open(method ? method : "GET", url, true);
    if(!reqstr){ reqstr = null;}
    xhr.send(reqstr);
};

HttpLoader.loadJson = function(url, func, method, reqstr)
{
    HttpLoader.loadText(url, function(data){
        if(data){
            func( eval("(" + data + ")") );
        }
        else{
            func(null);
        }
    }, method, reqstr);
};
