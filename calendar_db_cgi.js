// -*- coding: utf-8 -*-
//
// async interface for calendar DB CGI.
//
// Copyright(c) 2009 AKIYAMA Kouhei.


// require http_loader.js

function CalendarData()
{
}
CalendarData.CGI_DIR = "."
CalendarData.prototype = {
    readEventItems: function(firstDate, lastDate, callback)
    {
        if(!callback){return;}

        // list.rb?first=YYYYMMDD&last=YYYYMMDD
        //  (An interval that does not contains lastDate)
        // result: [ {date:<date>, value:<string>}, ... ]
        var url = CalendarData.CGI_DIR + "/list.rb?" + HttpLoader.encodeKeyValue({
            first: this.toYYYYMMDD(firstDate),
            last: this.toYYYYMMDD(lastDate)
        });
        HttpLoader.loadJson(url, callback, "GET", null);
    },

    changeEventItem: function(date, oldValue, newValue, callback)
    {
        // modify.rb?date=YYYYMMDD&old=<oldValue>&new=<newValue>
        // result: {succeeded:<bool>   , value:<string>}

        var url = CalendarData.CGI_DIR + "/modify.rb";
        var reqstr = HttpLoader.encodeKeyValue({
            date: this.toYYYYMMDD(date),
            old:oldValue,
            'new':newValue
        });
        HttpLoader.loadJson(url, function(data){
            if(callback){
                if(data){
                    callback(data.succeeded, data.value);
                }
                else{
                    callback(false, oldValue);
                }
            }
        }, "POST", reqstr);
    },

    toYYYYMMDD: function(date)
    {
        return (date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate()).toString();
    }
};

