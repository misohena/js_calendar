// -*- coding: utf-8 -*-
//
// クッキーへデータを保存するカレンダーデータベースインタフェースです。
//
// ブラウザがデータを記憶するため、サーバーを用意する必要がありません。
// ただし保存できる容量は3800バイトまでです。その容量を越えた時点でそれ以上書き込めなくなります。
// 7日以上過ぎたイベントは自動的に消去するので、沢山の予定を書き込まなければある程度使い続けることが出来ます。
// ただしクッキーは何かの拍子に誤って消してしまうことがあるので、あまり信用しない方が良いかもしれません。
//
// Copyright(c) 2009 AKIYAMA Kouhei.
// 
function CalendarData()
{
}
CalendarData.prototype = {
    readEventItems: function(firstDate, lastDate, callback)
    {
        if(!callback){return;}

        // read all events from the cookie.
        var events = this.getEvents();

        // filter events [firstDate, lastdate)
        var firstNum = this.convDateToNum(firstDate);
        var lastNum = this.convDateToNum(lastDate);
        var eventsInRange = new Array();
        for(var i = 0; i < events.length; ++i){
            var d = this.convDateToNum(events[i].date);
            if(d >= firstNum && d < lastNum){
                eventsInRange.push(events[i]);
            }
        }

        // notify the result.
        callback(eventsInRange);
    },

    changeEventItem: function(date, oldValue, newValue, callback)
    {
        // read all events from the cookie.
        var events = this.getEvents();

        // find the index of the target event(date, oldValue).
        var target;
        var dateNum = this.convDateToNum(date);
        for(target = 0; target < events.length; ++target){
            if(this.convDateToNum(events[target].date) == dateNum && events[target].value == oldValue){
                break;
            }
        }

        var succeeded = false;
        if(! oldValue && newValue){
            // add new event.
            events.push({date: new Date(date), value: newValue});
            succeeded = true;
        }
        else if(oldValue && ! newValue){
            // delete event.
            if(target < events.length){
                events.splice(target, 1);
                succeeded = true;
            }
            else{
                //error
            }
        }
        else if(oldValue && newValue){
            // change event value.
            if(target < events.length){
                events[target].value = newValue;
                succeeded = true;
            }
            else{
                //error
            }
        }

        // write all events to the cookie.
        if(succeeded){
            succeeded = this.setEvents(events);
        }

        // notify the result.
        if(callback){
            callback(succeeded, succeeded ? newValue : "");
        }
    },

    convDateToNum: function(date)
    {
        return date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
    },

    convNumToDate: function(num)
    {
        return new Date(Math.floor(num / 10000), Math.floor(num/100)%100-1, num%100);
    },

    cookieName: "events",
    cookieLengthMax: 3800,
    
    getEvents: function()
    {
        var cookies = document.cookie;
        //alert(cookies);
        var pos = cookies.indexOf(this.cookieName + "=");
        if(pos == -1){
            return [];
        }

        var first = pos + this.cookieName.length + 1;
        var last = cookies.indexOf(";", first);
        if(last == -1){
            last = cookies.length;
        }
        // ex: "events=20091107:birthday&20091107:meeting&20091120:holiday"
        var cookieValue = cookies.substring(first, last);
        var events = new Array();
        var lines = cookieValue.split('&');
        for(var i = 0; i < lines.length; ++i){
            var datevalue = lines[i].split(':');
            events.push({
                date: this.convNumToDate(parseInt(datevalue[0])),
                value: unescape(datevalue[1])
            });
        }

        ///@todo sort
        
        return events;
    },
    
    setEvents: function(events)
    {
        // create a cookie value. and remove old events.
        var dateNumLower = this.convDateToNum(new Date((new Date()).getTime() - 7*24*60*60*1000));
        var cookieValue = "";
        for(var i = 0; i < events.length; ++i){
            var dateNum = this.convDateToNum(events[i].date);
            if(dateNum < dateNumLower){
                continue;
            }

            if(cookieValue != ""){
                cookieValue += "&";
            }
            cookieValue += dateNum + ":" + escape(events[i].value)
        }

        // validate length of cookie value.
        if(cookieValue.length >= this.cookieLengthMax){
            return false; // error
        }

        // expiration date of the cookie value.
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);

        // write a cookie.
        var cookie = this.cookieName + "=" + cookieValue
            + "; expires=" + expires.toGMTString();
        //alert(cookie);
        document.cookie = cookie;

        return true;
    }
};

