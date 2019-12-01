@disease_names.each do |disease|
    json.set! disease.name do
        @years.each do |year|
            year_pops = @diseases.find_all {|record| record.year == year.year && record.name == disease.name}

            json.set! year.year do
                json.type "FeatureCollection"
                json.features year_pops.each do |el|
                    json.type "Feature"
                    json.geometry JSON.parse(el.pop_points)
                    json.properties do
                        json.STATE_ID "#{el.state_id}" # << wants it as a string
                        # json.name el.name
                        json.rate el.rate
                        json.year el.year
                        # json.state el.state.name
                    end
                    json.id el.state_id
                end
            end
        end
    end
end

# {
#     tb: {
#         2019: {
#             type: "FeatureCollection",
#             features: {
#                 type: "Feature",
#                 properties: {
#                     STATE_ID: 6
#                 }
#             }
#         }
#     }
# }