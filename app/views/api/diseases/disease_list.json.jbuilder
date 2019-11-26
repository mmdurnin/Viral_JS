json.disease_list @disease_list.each do |disease|
    json.extract! disease, :name
end