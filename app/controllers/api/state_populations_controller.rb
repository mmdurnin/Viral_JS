class Api::StatePopulationsController < ApplicationController

    def index
        @state_pops = StatePopulation.select("id, state_id, year, ST_AsGeoJSON(geom) AS pop_points")
        @years = StatePopulation.select(:year).group(:year)
    end

    def sort_year
        @yr_state_pops = StatePopulation.select("id, state_id, year, ST_ASGeoJSON(geom) AS pop_points").where("year = #{params[:year]}")
    end
end
