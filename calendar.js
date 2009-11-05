
// require holiday.js (function ktHolidayName)
// require calendar_db_*.js (function/class CalendarData)


//
// event item control.
// input/show a event description.
//
function CalendarEventItemCtrl(cell, value, inputMode, date, db)
{
    this.date = date;
    this.db = db;
    this.cell = cell;
    this.div      = null;
    this.textarea = null;
    this.msg      = null;
    this.value = value;
    
    if(inputMode){
        this.textarea = this.createTextArea(value);
        this.cell.appendChild(this.textarea);
        this.textarea.focus();
    }
    else{
        this.div = this.createDiv(value);
        this.cell.appendChild(this.div);
    }
}
CalendarEventItemCtrl.prototype = {
    isEmpty: function() { return !this.textarea && !this.div && !this.msg;},
    isInputMode: function() { return !!this.textarea; },
    //isProcessing: function() { return !!this.msg; },
    
    createDiv: function(value)
    {
        var self = this;
        var div = document.createElement("div");
        div.className = CalendarApp.cssPrefix + "-event-item";
        div.appendChild(document.createTextNode(value));
        div.addEventListener("click",
                             function(){self.onDivClick();},
                             false);
        return div;
    },

    onDivClick: function()
    {
        if(!this.div){return;}

        this.textarea = this.createTextArea(this.value);
        this.cell.insertBefore(this.textarea, this.div);
        this.textarea.focus();
        
        this.cell.removeChild(this.div);
        this.div = null;
    },

    createTextArea: function(value)
    {
        var self = this;
        var textarea = document.createElement("textarea");
        textarea.className = CalendarApp.cssPrefix + "-event-item-input";
        textarea.value = value;
        textarea.addEventListener("blur",
                                  function(){self.onTextAreaBlur();},
                                  false);
        return textarea;
    },

    onTextAreaBlur: function()
    {
        if(!this.textarea){return;}

        var self = this;
        var oldValue = this.value;
        var newValue = this.textarea.value;
        ///@todo 値の検証が必要。
        if(newValue != oldValue){
            this.value = newValue;

            this.msg = this.createMessageDiv("writing...");
            this.cell.insertBefore(this.msg, this.textarea);
            this.db.changeEventItem(
                this.date, oldValue, newValue,
                function(succeeded, currValue){self.onCalendarDataChanged(succeeded, currValue);});
        }
        else{
            if(newValue == ""){
                // cancel to create a new item.
            }
            else{
                this.div = this.createDiv(this.value);
                this.cell.insertBefore(this.div, this.textarea);
            }
        }
        this.cell.removeChild(this.textarea);
        this.textarea = null;
    },

    createMessageDiv: function(value)
    {
        var msg = document.createElement("div");
        msg.className = CalendarApp.cssPrefix + "-event-item-msg";
        msg.appendChild(document.createTextNode(value));
        return msg;
    },
    
    onCalendarDataChanged: function(succeeded, currValue)
    {
        if(!this.msg){return;}

        this.value = currValue;
        if(this.value == ""){
            // remove a item.
        }
        else{
            this.div = this.createDiv(this.value);
            this.cell.insertBefore(this.div, this.msg);
        }
        
        this.cell.removeChild(this.msg);
        this.msg = null;
    }
    
};


//
// calendar cell control.
//
function CalendarCellCtrl(cell, date, db)
{
    var self = this;
    this.date = new Date(date);
    this.db = db;
    this.cell = cell;
    this.cell.addEventListener("click",
                               function(){ self.onCellClick();},
                               false);
    this.items = new Array();
}
CalendarCellCtrl.prototype = {
    onCellClick: function()
    {
        for(var i = 0; i < this.items.length; ++i){
            if(this.items[i].isInputMode()){
                return;
            }
        }

        ///@todo isEmptyな項目を削除する。
        ///@todo 個数制限を設ける。
        
        this.items.push(new CalendarEventItemCtrl(this.cell, "", true, this.date, this.db));
    }

};


var CalendarApp = {
    cssPrefix: "calendar",
    weekDayNames: ["日", "月", "火", "水", "木", "金", "土"],
    holidayDaysOfWeek: (1<<0) | (1<<6),
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
        return ((CalendarApp.holidayDaysOfWeek >> date.getDay()) & 1)
            || !!CalendarApp.getHolidayName(date);
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
        var date = new Date(firstDate);
        
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
    
    createDateContentCell: function(date, now, db)
    {
        var cell = document.createElement("td");
        cell.className = CalendarApp.getDateClassName(date, now) + "-content";

        var ctrl = new CalendarCellCtrl(cell, date, db);
        
        return cell;
    },
    
    createDateHeaderRow: function(firstDate, now)
    {
        return CalendarApp.createWeekRow(
            firstDate,
            function(date){return CalendarApp.createDateHeaderCell(date, now);},
            CalendarApp.cssPrefix + "-date-header-row");
    },

    createDateContentRow: function(firstDate, now, db)
    {
        return CalendarApp.createWeekRow(
            firstDate,
            function(date){return CalendarApp.createDateContentCell(date, now, db);},
            CalendarApp.cssPrefix + "-date-content-row");
    },

    createCalendarTable: function()
    {
        var db = new CalendarData();
        
        var table = document.createElement("table");
        table.className = CalendarApp.cssPrefix + "-table";

        var now = new Date();
        var nowPosOnWeek = (7 + now.getDay() - CalendarApp.firstDayOfWeek) % 7;
        
        var date = new Date();
        date.setTime(now.getTime() - (nowPosOnWeek + 7) * 24*60*60*1000);

        table.appendChild(CalendarApp.createWeekDayNamesRow(date));
        for(var week = 0; week < 10; ++week){
            table.appendChild(CalendarApp.createDateHeaderRow(date, now));
            table.appendChild(CalendarApp.createDateContentRow(date, now, db));
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

