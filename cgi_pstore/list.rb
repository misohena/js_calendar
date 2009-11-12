#!/usr/bin/ruby
# Copyright(c) 2009 AKIYAMA Kouhei.

#
# synopsis: list.rb?first=YYYYMMDD&last=YYYYMMDD
#           (An interval that does not contains lastDate)
# result: [ {date:<date>, value:<string>}, ... ]
#
require 'cgi'
require 'date'
require 'pstore'

require 'utils'

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


print "Content-type: text/plain;charset=utf-8\n\n"
print "[\n"
i = first_index
while i < last_index
  if i != first_index
    print ",\n"
  end

  print "{date:new Date(#{events[i]["date"].year},#{events[i]["date"].month}-1,#{events[i]["date"].mday}), value:#{to_json_string(events[i]["value"])}}"

  i = i + 1
end
print "\n]\n"
