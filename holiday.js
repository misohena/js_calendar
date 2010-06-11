// -*- coding: utf-8 -*-
//
// Copyright(c) 2009 AKIYAMA Kouhei.
/*
参考文献:
- http://law.e-gov.go.jp/htmldata/S23/S23HO178.html
  国民の祝日に関する法律
  （昭和二十三年七月二十日法律第百七十八号）
  最終改正：平成一七年五月二〇日法律第四三号

- http://law.e-gov.go.jp/htmldata/S41/S41SE376.html
  建国記念の日となる日を定める政令
  （昭和四十一年十二月九日政令第三百七十六号）
*/

var JapaneseHoliday = {};

JapaneseHoliday.getNationalHolidayName = function(date)
{
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dayweek = date.getDay();
    var numweek = Math.floor((day - 1) / 7) + 1;

    if(year < 2008){
        return null; // 2008年以降のみ対応
    }
    
    if(month == 1 && day == 1){
        return "元日";
    }
    if(month == 1 && dayweek == 1 && numweek == 2){
        return "成人の日";
    }
    if(month == 2 && day == 11){ //「建国記念の日となる日を定める政令」による。
        return "建国記念の日";
    }
    if(month == 3 && day == JapaneseHoliday.getSpringEquinoxDate(year)){
        return "春分の日";
    }
    if(month == 4 && day == 29){
        return "昭和の日";
    }
    if(month == 5 && day == 3){
        return "憲法記念日";
    }
    if(month == 5 && day == 4){
        return "みどりの日";
    }
    if(month == 5 && day == 5){
        return "こどもの日";
    }
    if(month == 7 && dayweek == 1 && numweek == 3){
        return "海の日";
    }
    if(month == 9 && dayweek == 1 && numweek == 3){
        return "敬老の日";
    }
    if(month == 9 && day == JapaneseHoliday.getAutumnEquinoxDate(year)){
        return "秋分の日";
    }
    if(month == 10 && dayweek == 1 && numweek == 2){
        return "体育の日";
    }
    if(month == 11 && day == 3){
        return "文化の日";
    }
    if(month == 11 && day == 23){
        return "勤労感謝の日";
    }
    if(month == 12 && day == 23){
        return "天皇誕生日";
    }
    return null;
};

JapaneseHoliday.getHolidayName = function(date)
{
    // 3.1 「国民の祝日」は、休日とする。
    var nh = JapaneseHoliday.getNationalHolidayName(date);
    if(nh){
        return nh;
    }

    // 3.2 「国民の祝日」が日曜日に当たるときは、その日後においてその日に最も近い「国民の祝日」でない日を休日とする。
    var dw = date.getDay();
    if(dw > 0){
        var prevDate = new Date(date);
        for(; dw > 0; --dw){
            prevDate.setTime(prevDate.getTime() - 24*60*60*1000);
            if(!JapaneseHoliday.getNationalHolidayName(prevDate)){
                break;
            }
        }
        if(dw == 0){
            return "振替休日";
        }
    }
    
    // 3.3 その前日及び翌日が「国民の祝日」である日（「国民の祝日」でない日に限る。）は、休日とする。
    var tomorrow =new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
    var yesterday =new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);
    if(JapaneseHoliday.getNationalHolidayName(yesterday) && JapaneseHoliday.getNationalHolidayName(tomorrow)){
        return "国民の休日";
    }
    
    return null;
};


JapaneseHoliday.getSpringEquinoxDate = function(year)
{
    if(year >= 1980 && year < 2100){
        return Math.floor(20.8431 + 0.242194 * (year - 1980)) - Math.floor((year - 1980)/4);
    }
    else{
        return null;
    }
};

JapaneseHoliday.getAutumnEquinoxDate = function(year)
{
    if(year >= 1980 && year < 2100){
        return Math.floor(23.2488 + 0.242194 * (year - 1980)) - Math.floor((year - 1980)/4);
    }
    else{
        return null;
    }
};
