//
// async interface for calendar DB.
//

// require http_loader.js

function CalendarData()
{
}
CalendarData.prototype = {
    readEventItems: function(firstDate, lastDate, callback)
    {
        if(!callback){return;}

        // list.rb?first=YYYYMMDD&last=YYYYMMDD
        //  (An interval that does not contains lastDate)
        // result: [ {date:<date>, value:<string>}, ... ]
        var url = "list.rb?" + HttpLoader.encodeKeyValue({
            first: this.toYYYYMMDD(firstDate),
            last: this.toYYYYMMDD(lastDate)
        });
        HttpLoader.loadJson(url, callback, "GET", null);
//            callback([
//                {date:new Date(2009,11-1,15), value:"�\��1"},
//                {date:new Date(2009,11-1,25), value:"11:00 �\��2"},
//            ]);
    },

    changeEventItem: function(date, oldValue, newValue, callback)
    {
        if(!callback){return;}

        // modify.rb?date=YYYYMMDD&old=<oldValue>&new=<newValue>
        // result: {succeeded:<bool>   , value:<string>}

        var url = "modify.rb";
        var reqstr = HttpLoader.encodeKeyValue({
            date: this.toYYYYMMDD(date),
            old:oldValue,
            'new':newValue
        });
        HttpLoader.loadJson(url, function(data){
            if(data){
                callback(data.succeeded, data.value);
            }
            else{
                callback(false, oldValue);
            }
        }, "POST", reqstr);

//            callback(
//                true, // succeeded?
//                newValue // current value
//            ); 

    },

    toYYYYMMDD: function(date)
    {
        return (date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate()).toString();
    }
};

