json.array!(@disease_list) do |disease|
    json.extract! disease, :name
end