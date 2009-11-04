
var CalendarApp = {
    cssPrefix: "calendar",
    weekDayNames: ["日", "月", "火", "水", "木", "金", "土"],
    firstDayOfWeek: 0,

    // time/date Utilities
    
    getHolidayName: function(date)
    {
        // AddinBox( http://www.h3.dion.ne.jp/~sakatsu/index.htm )の
        // 祝日判定ロジック( http://www.h3.dion.ne.jp/~sakatsu/holiday_logic.htm )を
        // 使わせていただいております。
        var dateStr = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        return ktHolidayName(dateStr);
    },

    isHoliday: function(date)
    {
        return date.getDay() == 0 || date.getDay() == 6 || !!CalendarApp.getHolidayName(date);
    },

    isPastDate: function(date, now)
    {
        if(!now){
            now = new Date();
        }

        if(date.getFullYear() < now.getFullYear())
            return true;
        if(date.getFullYear() > now.getFullYear()){
            return false;
        }
        if(date.getMonth() < now.getMonth()){
            return true;
        }
        if(date.getMonth() > now.getMonth()){
            return false;
        }
        if(date.getDate() < now.getDate()){
            return true;
        }
        //if(date.getDate() > now.getDate()){
        //    return false;
        //}
        return false;
    },

    addDate: function(date, delta)
    {
        date.setTime(date.getTime() + delta * (24*60*60*1000));
    },
    

    // Web Utilities

    getLastScriptNode: function()
    {
        var n = document;
        while(n && n.nodeName.toLowerCase() != "script") { n = n.lastChild;}
        return n;
    },

    
    // View
    
    createWeekRow: function(firstDate, func, rowClassName)
    {
        var date = new Date();
        date.setTime(firstDate.getTime());
        
        var row = document.createElement("tr");
        row.className = rowClassName;
        for(var d = 0; d < 7; ++d){
            row.appendChild(func(date));
            CalendarApp.addDate(date, 1);
        }
        return row;
    },

    createWeekDayNamesRow: function(firstDate)
    {
        return CalendarApp.createWeekRow(
            firstDate,
            function(date){
                var th = document.createElement("th");
                th.appendChild(document.createTextNode(CalendarApp.weekDayNames[date.getDay()]));
                return th;
            },
            CalendarApp.cssPrefix + "-weekdaynames-row");
    },

    getDateClassName: function(date, now)
    {
        return CalendarApp.cssPrefix + (
            CalendarApp.isPastDate(date, now) ? "-pastday" :
            CalendarApp.isHoliday(date) ? "-holiday" :
            "-normalday");
    },

    createDateHeaderCell: function(date, now)
    {
        var cell = document.createElement("td");
        cell.className = CalendarApp.getDateClassName(date, now) + "-header";

        if(date.getDate() == 1){
            var monthName = document.createElement("span");
            monthName.className = CalendarApp.cssPrefix + "-month-name";
            monthName.appendChild(document.createTextNode(1 + date.getMonth()));
            cell.appendChild(monthName);
            cell.appendChild(document.createTextNode("/" + date.getDate()));
        }
        else{
            cell.appendChild(document.createTextNode(date.getDate()));
        }
        
        var holidayName = CalendarApp.getHolidayName(date);
        if(holidayName){
            cell.appendChild(document.createTextNode(":" + holidayName));
        }
        return cell;
    },
    
    createDateContentCell: function(date, now)
    {
        var cell = document.createElement("td");
        cell.className = CalendarApp.getDateClassName(date, now) + "-content";
        return cell;
    },
    
    createDateHeaderRow: function(firstDate, now)
    {
        return CalendarApp.createWeekRow(
            firstDate,
            function(date){return CalendarApp.createDateHeaderCell(date, now);},
            CalendarApp.cssPrefix + "-date-header-row");
    },

    createDateContentRow: function(firstDate, now)
    {
        return CalendarApp.createWeekRow(
            firstDate,
            function(date){return CalendarApp.createDateContentCell(date, now);},
            CalendarApp.cssPrefix + "-date-content-row");
    },

    createCalendarTable: function()
    {
        var table = document.createElement("table");
        table.className = CalendarApp.cssPrefix + "-table";

        var now = new Date();
        var nowPosOnWeek = (7 + now.getDay() - CalendarApp.firstDayOfWeek) % 7;
        
        var date = new Date();
        date.setTime(now.getTime() - (nowPosOnWeek + 7) * 24*60*60*1000);

        table.appendChild(CalendarApp.createWeekDayNamesRow(date));
        for(var week = 0; week < 10; ++week){
            table.appendChild(CalendarApp.createDateHeaderRow(date, now));
            table.appendChild(CalendarApp.createDateContentRow(date, now));
            CalendarApp.addDate(date, 7);
        }
        return table;
    },
    
    placeCalendar: function()
    {
        var parent = CalendarApp.getLastScriptNode().parentNode;
        parent.appendChild(CalendarApp.createCalendarTable());
    }
    
}

