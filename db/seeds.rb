# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

State.destroy_all
Disease.destroy_all

require "json"
require 'rgeo/geo_json'
require 'csv'



# States

file = File.open "./data/us_states.geojson"
data = JSON.load file
factory = RGeo::Geos.factory(:srid => 4326)
state_arr = []

data["features"].each do |feature|
    state_hash = {}
    state_hash[:id] = feature["properties"]["STATE_ID"]
    state_hash[:name] = feature["properties"]["STATE_NAME"]

    json = feature

    if feature["geometry"]["type"] == "Polygon"
        poly_text = RGeo::GeoJSON.decode(json).geometry.to_s
        polygon = factory.parse_wkt(poly_text)
        state_hash[:geom] = factory.multi_polygon([polygon]).to_s
    else
        state_hash[:geom] = RGeo::GeoJSON.decode(json).geometry.to_s
    end

    state_arr.push(state_hash)
end

State.create(state_arr)



# Tuberculosis

tb_arr = []
state_keys = State.select(:id, :name)

CSV.foreach(Rails.root.join('data/tb_state_2000-2017.csv'), headers: true) do |row|

    disease_hash = {}
    id = state_keys.find_by(name: row["Geography"]).id

    print row["Geography"] if id == nil 

    disease_hash[:name] = "tb"
    disease_hash[:rate] = row["Rate per 100000"].to_f
    disease_hash[:year] = row["Year"].to_i
    disease_hash[:state_id] = id

    tb_arr.push(disease_hash)
end

Disease.create(tb_arr)





# Chlamydia

ch_arr = []
CSV.foreach(Rails.root.join('data/chlamydia_state_2000-2017.csv'), headers: true) do |row|

    disease_hash = {}
    id = state_keys.find_by(name: row["Geography"]).id

    print row["Geography"] if id == nil

    disease_hash[:name] = "chlamydia"
    disease_hash[:rate] = row["Rate per 100000"].to_f
    disease_hash[:year] = row["Year"].to_i
    disease_hash[:state_id] = id

    ch_arr.push(disease_hash)
end

Disease.create(ch_arr)