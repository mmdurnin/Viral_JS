
json.type "FeatureCollection"

json.features @diseases.each do |el|
    json.type "Feature"
    json.geometry JSON.parse(el.pop_points)
    json.properties do
        json.state_id "#{el.state_id}" # << wants it as a string
        json.rate el.rate
        json.year el.year
        json.name el.name
        json.state el.state.name
    end
    json.id el.state_id
end
