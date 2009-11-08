
require 'date'
require 'uri'

def str_to_date(str)
  n = str.to_i
  return Date.new(n / 10000, n / 100 % 100, n % 100)
end

def lower_bound_by_date(arr, date)
  first = 0
  last = arr.length

  while first < last
    mid = (first + last) / 2
    if arr[mid]["date"] < date
      first = mid + 1
    else
      last = mid
    end
  end
  return first
end

def upper_bound_by_date(arr, date)
  first = 0
  last = arr.length

  while first < last
    mid = (first + last) / 2
    if ! (date < arr[mid]["date"])
      first = mid + 1
    else
      last = mid
    end
  end
  return first
end

def find_value(arr, value, low, upp)
  index = low
  while index < upp
    if arr[index]["value"] == value
      break
    end
    index = index + 1
  end
  return index
end

def to_json_string(str)
#  return "decodeURIComponent(\"" + URI.escape(str, /[^-_.!~*'()a-zA-Z\d?@]/n) + "\")";

  s = str.gsub(/[^\x20-\x21\x23-\x5b\x5d-\xff]/n) do |ch|
    c = ch[0].ord
    if c != 0 && (index = "\"\\/\b\f\n\r\t".index(ch[0]))
      "\\" + "\"\\/bfnrt"[index, 1]
    else
      sprintf("\\u%04X", c)
    end
  end
  return '"' + s + '"'
end
