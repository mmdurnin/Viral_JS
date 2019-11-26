json.diseases @diseases.each do |disease|
    json.extract! disease, :id, :state_id, :name, :rate, :year
end