# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

State.destroy_all
Disease.destroy_all 
StatePopulation.destroy_all

require "json"
require 'rgeo/geo_json'
require 'csv'
require 'date'




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
        state_hash[:geom] = RGeo::GeoJSON.decode(json).geometry.to_s #decode json file, turn into object of type RGEO::GeoJSON (from library), accesses geometry part of object, turn into string to store in db
    end

    state_arr.push(state_hash)
end

p "creating state records"
State.create(state_arr)


state_keys = State.all.pluck(:id, :name) #use this for all of the following tables




# State Populations

pops_arr = []

CSV.foreach(Rails.root.join('data/state_pops_1990-2022.csv'), headers: true) do |row|
    pops_hash = {}
    id = state_keys.find {|el| el[1] == row["state"]}[0]

    print row["state"] if id == nil 

    pops_hash[:population] = row["population"].delete(",").to_i
    pops_hash[:year] = row["year"].to_i
    pops_hash[:state_id] = id

    num_points = pops_hash[:population] / 100000

    json_points = ActiveRecord::Base.connection.execute("SELECT ST_GeneratePoints(geom, #{num_points}) FROM states WHERE id = #{id};")
    pops_hash[:geom]= json_points.values[0][0]

    # SQL qeury on states table.  Use method ST_Generate points with args 1. geom (geom column) and 2. num points
    # Generate points takes the state coords, the number of points I want in that state, and generates random points within those confinements!
    # ActiveRecord::Base.connection.execute returns an object of type result. Grab info by saying ".values"
    # It ended up return info double nested (.select returns many rows = 1 level of nesting; .select returns however many things specified (ie columns) = 2nd level of nesting)
    #   so key in by saying [0][0]
    # By the way, this will return a really ugly ("encoded") string, which is fine because that's the way it will be stored in the db anyway.
    #   It is the form that this info is stored in the db. I'll convert it into geojson when I need it.

    pops_arr.push(pops_hash)

end

p "creating state populations"
StatePopulation.create(pops_arr)




# Tuberculosis

tb_arr = []

CSV.foreach(Rails.root.join('data/tb_state_2000-2017.csv'), headers: true) do |row|

    disease_hash = {}

    id = state_keys.find {|el| el[1] == row["Geography"]}[0]

    print row["Geography"] if id == nil 

    disease_hash[:name] = "tb"
    disease_hash[:rate] = row["Rate per 100000"].to_f
    disease_hash[:year] = row["Year"].to_i
    disease_hash[:state_id] = id

    pop = pops_arr.find {|record| record[:state_id] == id && record[:year].to_i == row["Year"].to_i}
    p row["Geography"] if pop == nil

    # num_points = (pop[:population] / 100000) * disease_hash[:rate]
    num_points = disease_hash[:rate].round
    disease_hash[:points] = num_points
    json_points = ActiveRecord::Base.connection.execute("SELECT ST_GeneratePoints(geom, #{num_points}) FROM states WHERE id = #{id};")
    disease_hash[:geom] = json_points.values[0][0]

    tb_arr.push(disease_hash)
end

p "creating tuberculosis"
Disease.create(tb_arr)




# Chlamydia

ch_arr = []

CSV.foreach(Rails.root.join('data/chlamydia_state_2000-2017.csv'), headers: true) do |row|

    disease_hash = {}
    id = state_keys.find {|el| el[1] == row["Geography"]}[0]

    print row["Geography"] if id == nil

    disease_hash[:name] = "chlamydia"
    disease_hash[:rate] = row["Rate per 100000"].to_f
    disease_hash[:year] = row["Year"].to_i
    disease_hash[:state_id] = id

    pop = pops_arr.find {|record| record[:state_id] == id && record[:year].to_i == row["Year"].to_i}
    p row["Geography"] if pop == nil

    # num_points = ( (pop[:population] / 100000) * disease_hash[:rate] ) / 100
    num_points = (disease_hash[:rate] / 10).round
    disease_hash[:points] = num_points
    json_points = ActiveRecord::Base.connection.execute("SELECT ST_GeneratePoints(geom, #{num_points}) FROM states WHERE id = #{id};")
    disease_hash[:geom] = json_points.values[0][0]


    ch_arr.push(disease_hash)
end

p "creating chlamydia"
Disease.create(ch_arr)




# Hepatitis

hep_arr = []

CSV.foreach(Rails.root.join('data/hepab_state_2000-2017.csv'), headers: true) do |row|

    disease_hash = {}
    id = state_keys.find {|el| el[1] == row["Geography"]}[0]

    print row["Geography"] if id == nil

    disease_hash[:name] = row["Indicator"]
    disease_hash[:year] = row["Year"].to_i
    disease_hash[:state_id] = id

    if row["Rate per 100000"] == "Data not available"
        disease_hash[:rate] = 0
    else
        disease_hash[:rate] = row["Rate per 100000"].to_f
    end


    pop = pops_arr.find {|record| record[:state_id] == id && record[:year].to_i == row["Year"].to_i}
    p row["Geography"] if pop == nil


    num_points = disease_hash[:rate].round
    disease_hash[:points] = num_points
    json_points = ActiveRecord::Base.connection.execute("SELECT ST_GeneratePoints(geom, #{num_points}) FROM states WHERE id = #{id};")
    disease_hash[:geom] = json_points.values[0][0]


    hep_arr.push(disease_hash)
end

p "creating Hepatitis"
Disease.create(hep_arr)




# COVID

# current_month_year is a hash we hold to roll up days into months & reduuce amount of data ultimately sent to the FE
current_month_year = {state: "Alaska", month: "01", year: "2020", sum: 0}
covid_arr = []

CSV.foreach(Rails.root.join('data/covid_state_2020-2022.csv'), headers: true) do |row|
    submission_date_arr = row["Submission Date"].split('/')
    year = submission_date_arr[2]
    month = submission_date_arr[0]
    day = submission_date_arr[1]
    state = row["Geography"]
    new_cases = row["New Cases"]

    id = state_keys.find {|el| el[1] == state}[0]
    print state if id == nil

    pop = pops_arr.find {|record| record[:state_id] == id && record[:year].to_i == year.to_i}
    p state if pop == nil

    if month != current_month_year[:month] || year != current_month_year[:year] || state != current_month_year[:state]
        # if we've hit a new month or a new state, reset everything and add our current totals to covid_arr
        disease_hash = {}
        disease_hash[:name] = "COVID"
        disease_hash[:state_id] = id
        disease_hash[:submission_date] = Time.new(year, month).to_datetime
        # rate per 10,000
        disease_hash[:rate] = current_month_year[:sum] / pop[:population].to_f * 10000 

        # We configured our db in a way that assumes state-year-disease shuld be a unique trio. This does not support our
        # COVID data, which is much more granular (monthly). For ease, we'll stick a unique year value here
        # even though in reality, this value is composed of year-month (ex: "01/31/2022" => 202201)
        disease_hash[:year] = (year + month).to_i

        num_points = disease_hash[:rate].round
        disease_hash[:points] = num_points
        json_points = ActiveRecord::Base.connection.execute("SELECT ST_GeneratePoints(geom, #{num_points}) FROM states WHERE id = #{id};")
        disease_hash[:geom] = json_points.values[0][0]

        covid_arr.push(disease_hash)
        current_month_year = {state: state, month: month, year: year, sum: new_cases.to_f}
    else
        # otherwise, add current day total to our sum
        current_month_year[:sum] += new_cases.to_f
    end

    
end

p "creating Covid"
Disease.create(covid_arr)