
function CalendarCellCtrl(cell)
{
    var self = this;
    this.cell = cell;
    this.cell.addEventListener("click",
                               function(){ self.onCellClick();},
                               false);
    this.textarea = null;
}
CalendarCellCtrl.prototype = {
    onCellClick: function()
    {
        var self = this;
        if(this.textarea){
            return;
        }
        var textarea = document.createElement("textarea");
        this.cell.appendChild(textarea);
        textarea.focus();
        textarea.addEventListener("blur",
                                  function() { self.onTextAreaBlur();},
                                  false);
        this.textarea = textarea;
    },

    onTextAreaBlur: function()
    {
        if(!this.textarea){
            return;
        }
        var value = this.textarea.value;
        if(value){
            var div = document.createElement("div");
            div.className = CalendarApp.cssPrefix + "-item-div";
            div.appendChild(document.createTextNode(value));
            this.cell.appendChild(div);
        }
        this.cell.removeChild(this.textarea);
        this.textarea = null;
    }
    
};


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

    createDomNode: function(obj)
    {
        if(!obj){
            return null;
        }

        if(obj.elem){
            var e = document.createElement(obj.elem);
            
            if(obj.children){
                for(var i = 0; i < obj.children.length; ++i){
                    var child = CalendarApp.createDomNode(obj.children[i]);
                    if(child){
                        e.appendChild(child);
                    }
                }
            }
            
            if(obj.atrs){
                for(var key in obj.atrs){
                    e[key] = obj.atrs[key];
                }
            }
            return e;
        }
        else if(obj.textnode){
            var t = document.createTextNode(obj.textnode);
            return t;
        }
        else{
            return null;
        }

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

        var ctrl = new CalendarCellCtrl(cell);
        
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

