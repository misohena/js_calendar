
var weekDayNames = ["日", "月", "火", "水", "木", "金", "土"];
var firstDayOfWeek = 0;


function getHolidayName(date)
{
    // AddinBox( http://www.h3.dion.ne.jp/~sakatsu/index.htm )の
    // 祝日判定ロジック( http://www.h3.dion.ne.jp/~sakatsu/holiday_logic.htm )を
    // 使わせていただいております。
    var dateStr = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    return ktHolidayName(dateStr);
}

function isHoliday(date)
{
    return date.getDay() == 0 || date.getDay() == 6 || !!getHolidayName(date);
}

function isPastDate(date, now)
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
//    if(date.getDate() > now.getDate()){
//        return false;
//    }
    return false;
}




function getLastScriptNode()
{
    var n = document;
    while(n && n.nodeName.toLowerCase() != "script") { n = n.lastChild;}
    return n;
}

function createRowWeek(firstDate, func, rowClassName)
{
    var date = new Date();
    date.setTime(firstDate.getTime());
    
    var row = document.createElement("tr");
    row.className = rowClassName;
    for(var d = 0; d < 7; ++d){
        row.appendChild(func(date));
        date.setTime(date.getTime() + 24*60*60*1000);
    }
    return row;
}

function createHeaderRowWeekDayNames(firstDate)
{
    return createRowWeek(
        firstDate,
        function(date){
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(weekDayNames[date.getDay()]));
            return th;
        },
        "calendar-header-row-daynames");
}

function getDateClassName(date, now)
{
    return isPastDate(date, now) ? "calendar-pastday"
        : isHoliday(date) ? "calendar-holiday"
        : "calendar-normalday";
}

function createHeaderRowDates(firstDate, now)
{
    return createRowWeek(
        firstDate,
        function(date){
            var cell = document.createElement("td");
            cell.className = getDateClassName(date, now) + "-header";

            if(date.getDate() == 1){
                var monthName = document.createElement("span");
                monthName.className = "calendar-month-name";
                monthName.appendChild(document.createTextNode(1 + date.getMonth()));
                cell.appendChild(monthName);
                cell.appendChild(document.createTextNode("/" + date.getDate()));
            }
            else{
                cell.appendChild(document.createTextNode(date.getDate()));
            }
            
            var holidayName = getHolidayName(date);
            if(holidayName){
                cell.appendChild(document.createTextNode(":" + holidayName));
            }
            return cell;
        },
        "calendar-header-row-dates");
}

function createDataRowDates(firstDate, now)
{
    return createRowWeek(
        firstDate,
        function(date){
            var cell = document.createElement("td");
            cell.className = getDateClassName(date, now) + "-content";
            return cell;
        },
        "calendar-data-row-dates");
}

function placeCalendar()
{
    var table = document.createElement("table");
    table.className = "calendar-table";


    var now = new Date();
    var posOnWeek = (7 + now.getDay() - firstDayOfWeek) % 7;
    
    var date = new Date();
    date.setTime(now.getTime() - (posOnWeek + 7) * 24*60*60*1000);

    table.appendChild(createHeaderRowWeekDayNames(date));
    for(var week = 0; week < 10; ++week){
        table.appendChild(createHeaderRowDates(date, now));
        table.appendChild(createDataRowDates(date, now));
        date.setTime( date.getTime() + 7*24*60*60*1000 );
    }
    
    var parent = getLastScriptNode().parentNode;
    parent.appendChild(table);
}

