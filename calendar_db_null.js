//
// example of async interface for calendar DB.
//
function CalendarData()
{
}
CalendarData.prototype = {
    readEventItems: function(firstDate, lastDate, callback)
    {
        if(callback){
            callback([
//                {date:new Date(2009,11-1,15), value:"—\’è1"},
//                {date:new Date(2009,11-1,25), value:"11:00 —\’è2"},
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

