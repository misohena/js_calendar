//
// async interface for calendar DB.
//
function CalendarData()
{
}
CalendarData.prototype = {
    readEventItems: function(firstDate, lastDate, callback)
    {
        if(!callback){return;}

        var firstNum = this.toDateNum(firstDate);
        var lastNum = this.toDateNum(lastDate);
        var events = this.getEvents();
        var eventsIn = new Array();
        for(var i = 0; i < events.length; ++i){
            var d = this.toDateNum(events[i].date);
            if(d >= firstNum && d < lastNum){
                eventsIn.push(events[i]);
            }
        }
        callback(eventsIn);
    },

    changeEventItem: function(date, oldValue, newValue, callback)
    {
        var events = this.getEvents();
        var i;
        for(i = 0; i < events.length; ++i){
            if(this.toDateNum(events[i].date) == this.toDateNum(date) && events[i].value == oldValue){
                break;
            }
        }

        var succeeded = false;
        var currValue = "";
        if(! oldValue && newValue){
            events.push({date: new Date(date), value: newValue});
            succeeded = true;
            currValue = newValue;
        }
        else if(oldValue && ! newValue){
            if(i < events.length){
                events.splice(i, 1);
                succeeded = true;
                currValue = newValue;
            }
            else{
                //error
            }
        }
        else if(oldValue && newValue){
            if(i < events.length){
                events[i].value = newValue;
                succeeded = true;
                currValue = newValue;
            }
            else{
                //error
            }
        }

        this.setEvents(events);
        
        if(callback){
            callback(succeeded, currValue);
        }
    },

    toDateNum: function(date)
    {
        return date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
    },

    getEvents: function()
    {
        //alert(document.cookie);
        
        var events = new Array();
        var items = document.cookie.split(";");
        for(var i = 0; i < items.length; ++i){
            var found = items[i].match(/^ *d([0-9]+)=(.*)$/);
            if(found){
                var date = parseInt(found[1]);
                var value = found[2];
                events.push({
                    date: new Date(date / 10000, (date / 100 % 100)-1, date%100),
                    value: unescape(value)
                });
            }
        }
        return events;
    },

    setEvents: function(events)
    {
        var now = new Date();
        var expire = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
        var str = "";
        for(var i = 0; i < events.length; ++i){
            str += "d" + this.toDateNum(events[i].date).toString() + "=" + escape(events[i].value) + "; ";
        }
        str += "expires=" + expire.toGMTString();

        alert(str);
        document.cookie = str;
    }
};

