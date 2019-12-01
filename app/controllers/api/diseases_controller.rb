class Api::DiseasesController < ApplicationController

    def index
        # @diseases = Disease.where(name: params["name"])
        @diseases = Disease.select("id, rate, state_id, name, year, ST_AsGeoJSON(geom) AS pop_points").where("points > 0").includes(:state)
        @disease_names = Disease.select(:name).group(:name)
        @years = Disease.select(:year).group(:year)
    end

    def disease_list
        @disease_list = Disease.select(:name).group(:name)
    end

end
