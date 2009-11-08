#!/usr/bin/ruby

#
# synopsis: modify.rb?date=YYYYMMDD&old=<oldValue>&new=<newValue>
# result: {succeeded:<bool>, value:<string>}
#

MAX_EVENTS_PER_DAY = 10
MAX_EVENTS_PER_CALENDAR = 365*10
MAX_EVENT_VALUE_BYTES = 256

require 'cgi'
require 'date'
require 'pstore'

require 'utils'

def main()

  cgi = CGI.new
  date = cgi.has_key?('date') ? str_to_date(cgi['date']) : nil
  old_value = cgi.has_key?('old') ? cgi['old'] : nil
  new_value = cgi.has_key?('new') ? cgi['new'] : nil


  result = { "succeeded"=>false, "curr_value"=>""}

  if date == nil
    # error
  else
    db = PStore.new("calendar.db")
    db.transaction do

      # open DB
      if !db.root?("events")
        db["events"] = []
      end
      events = db.fetch("events", [])

      # add/delete/modify event
      old_value_valid = !(old_value == "" or old_value == nil)
      new_value_valid = !(new_value == "" or new_value == nil)
      if (! old_value_valid and new_value_valid)
        result = add_event(events, date, new_value)
      elsif (old_value_valid and ! new_value_valid)
        result = delete_event(events, date, old_value)
      elsif (old_value_valid and new_value_valid)
        result = modify_event(events, date, old_value, new_value)
      end
    end
  end

  print "Content-type: text/plain;charset=utf-8\n\n"
  print "{succeeded:#{result["succeeded"]}, value:#{to_json_string(result["curr_value"])}}\n"
end


def add_event(events, date, new_value)
  low = lower_bound_by_date(events, date)
  upp = upper_bound_by_date(events, date)

  if (upp - low < MAX_EVENTS_PER_DAY) and
      (events.length < MAX_EVENTS_PER_CALENDAR) and
      (new_value.length <= MAX_EVENT_VALUE_BYTES)
    events.insert(upp, {"date"=>date, "value"=>new_value})

    return { "succeeded"=>true, "curr_value"=>new_value}
  else
    # error
    return { "succeeded"=>false, "curr_value"=>""}
  end
end

def delete_event(events, date, old_value)
  low = lower_bound_by_date(events, date)
  upp = upper_bound_by_date(events, date)
  target = find_value(events, old_value, low, upp)

  if target < upp
    events.delete_at(target)
    return { "succeeded"=>true, "curr_value"=>""}
  else
    # error
    return { "succeeded"=>false, "curr_value"=>""}
  end
end

def modify_event(events, date, old_value, new_value)
  low = lower_bound_by_date(events, date)
  upp = upper_bound_by_date(events, date)
  target = find_value(events, old_value, low, upp)

  if target < upp
    if (new_value.length <= MAX_EVENT_VALUE_BYTES)
      events[target]["value"] = new_value
      return { "succeeded"=>true, "curr_value"=>new_value}
    else
      #error
      return { "succeeded"=>false, "curr_value"=>events[target]["value"]}
    end
  else
    # error
    return { "succeeded"=>false, "curr_value"=>""}
  end
end


main()

