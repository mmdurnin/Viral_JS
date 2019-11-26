json.type "FeatureCollection"
json.features @states.each do |state|
    json.type "Feature"
    json.geometry JSON.parse(state.coordinates)
    json.properties do
        json.STATE_ID "#{state.id}"
        json.STATE_NAME state.name
    end
    json.id state.id
end