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
            callback([]);
        }
    },

    changeEventItem: function(date, oldValue, newValue, callback)
    {
        if(callback){
            callback(true, newValue);
        }
    },
};

