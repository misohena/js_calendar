class Component
  def initialize(name)
    @name = name
    @props = []
    @subcompos = { }
  end

  def add_property(prop)
    @props.push(prop)
  end

  def add_subcomponent(name, compo)
    if !@subcompos.has_key?(name) then
      @subcompos[name] = []
    end
    @subcompos[name].push(compo)
  end

  def to_s
    props_str = ""
    @props.each do |prop|
      params_str = ""
      prop[:params].each { |param| params_str += ";" + param[0] + "=" + param[1]}

      #TODO fold line
      props_str += prop[:name] + params_str + ":" + prop[:value] + "\n"
    end

    subcompos_str = ""
    @subcompos.each do |subcompo|
      subcompos_str += subcompo.to_s
    end

    return "BEGIN:" + @name + "\n" + props_str + subcompos_str + "END:" + @name + "\n"
  end
end


# ref:RFC2445 4.1 Content Lines

def get_unfolded_line(io)
  if line = io.gets
    line.chop!
    # unfolding.
    while 1
      ch = io.getc
      if ch == 32 || ch == 9 then
        line += io.gets.chop
      else
        if ch != nil then
          io.ungetc(ch)
        end
        break
      end
    end
    return line
  else
    return nil
  end
end

def parse_content_line(io)
  if line = get_unfolded_line(io)
    nameparams_value = line.split(":", 2)
    name_params = nameparams_value[0].split(";");

    name = name_params[0]
    value = nameparams_value[1]
    params = name_params[1..-1].map{ |param| param.split("=", 2)}

    return { :name=>name, :value=>value, :params=>params}
  else
    return nil
  end
end

def parse_component(io, name)
  compo = Component.new(name)

  while cl = parse_content_line(io)
    #print cl.to_s + "\n"

    case cl[:name]
    when "BEGIN"
      compo.add_subcomponent(cl[:value], parse_component(io, cl[:value]))
    when "END"
      return compo
    else
      compo.add_property(cl)
    end
  end
  return compo
end

f = File.open("test.ics")
c = parse_component(f, "ROOT")
print c.to_s
