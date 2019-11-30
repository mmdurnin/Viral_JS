@years.each do |year|
    year_pops = @state_pops.find_all {|record| record.year == year.year}

    json.set! year.year do
        json.type "FeatureCollection"
        json.features year_pops.each do |state|
            json.type "Feature"
            json.geometry JSON.parse(state.pop_points)
            json.properties do 
                json.STATE_ID "#{state.state_id}" # << wants it as a string
            end
            json.id state.state_id
        end
    end
end