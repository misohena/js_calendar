// -*- coding: utf-8 -*-
//
// example of async interface for calendar DB.
//
// Copyright(c) 2009 AKIYAMA Kouhei.
//
function CalendarData()
{
}
CalendarData.prototype = {
    readEventItems: function(firstDate, lastDate, callback)
    {
        if(callback){
            callback([
//                {date:new Date(2009,11-1,15), value:"予定1"},
//                {date:new Date(2009,11-1,25), value:"11:00 予定2"},
            ]);
        }
    },

    changeEventItem: function(date, oldValue, newValue, callback)
    {
        if(callback){
            callback(
                true, // succeeded?
                newValue // current value
            ); 
        }
    },
};

