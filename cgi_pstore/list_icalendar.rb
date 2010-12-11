#!/usr/bin/ruby
# Copyright(c) 2010 AKIYAMA Kouhei.

#
# synopsis: list_icalendar.rb?first=YYYYMMDD&last=YYYYMMDD
#           (An interval that does not contains lastDate)
#
require 'cgi'
require 'date'
require 'pstore'

require 'utils'

CALENDAR_NAME = 'js_calendar'

cgi = CGI.new
first_date = cgi.has_key?('first') ? str_to_date(cgi['first']) : nil
last_date = cgi.has_key?('last') ? str_to_date(cgi['last']) : nil

db = PStore.new("calendar.db")
events = nil
db.transaction do
  events = db.fetch("events", [])
end

first_index = first_date ? lower_bound_by_date(events, first_date) : 0
last_index = last_date ? upper_bound_by_date(events, last_date) : events.length


#print "Content-type: text/plain;charset=utf-8\n\n"
print "Content-type: text/calendar;charset=utf-8\n\n"
print "BEGIN:VCALENDAR\n"+
  "PRODID:-//AKIYAMA Kouhei//js_calendar//EN\n"+
  "VERSION:2.0\n"+
  "X-WR-CALNAME:"+CALENDAR_NAME+"\n"+
  "X-WR-TIMEZONE:+0900\n"+
  "CALSCALE:GREGORIAN\n"

i = first_index
while i < last_index
  ev = events[i]
  value = ev["value"]
  date = ev["date"]
  dt = date.strftime("%Y%m%d")

  value.gsub!(/\\/, "\\\\\\")
  value.gsub!(/\n/, "\\n")

  # date/time
  if /^(([0-9]{1,2}):([0-9][0-9]))-(([0-9]{1,2}):([0-9][0-9])|) +(.+)/m =~ value
    value = $7
    dtstart = "DTSTART:"+dt+"T"+("0"+$2)[-2,2]+$3+"00"
    if $5 && $6
      dtend = "DTEND:"+dt+"T"+("0"+$5)[-2,2]+$6+"00"
    else
      dtend = "DTEND:"+dt+"T"+("0"+$2)[-2,2]+$3+"00"
    end
  else
    dtstart = "DTSTART;VALUE=DATE:"+dt
    dtend = "DTEND;VALUE=DATE:"+date.next.strftime("%Y%m%d")
  end

  # summary
  summary = value
  

  print "BEGIN:VEVENT\n"+
    dtstart+"\n"+
    dtend+"\n"+
    "SUMMARY:"+summary+"\n"+
    "DESCRIPTION:"+summary+"\n"+
    "END:VEVENT\n"

  i = i + 1
end

print "END:VCALENDAR\n"
