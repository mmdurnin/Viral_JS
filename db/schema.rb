# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_11_26_045508) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "diseases", force: :cascade do |t|
    t.integer "state_id", null: false
    t.string "name", null: false
    t.decimal "rate"
    t.integer "year", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_diseases_on_name"
    t.index ["state_id", "name", "rate", "year"], name: "index_diseases_on_state_id_and_name_and_rate_and_year", unique: true
    t.index ["state_id"], name: "index_diseases_on_state_id"
    t.index ["year"], name: "index_diseases_on_year"
  end

  create_table "states", force: :cascade do |t|
    t.string "name", null: false
    t.geometry "geom", limit: {:srid=>4326, :type=>"multi_polygon"}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "((geom)::geography)", name: "state_coords_idx", using: :gist
    t.index ["geom"], name: "index_states_on_geom", using: :gist
    t.index ["name"], name: "index_states_on_name"
  end

end
