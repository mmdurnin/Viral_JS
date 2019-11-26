class Api::DiseasesController < ApplicationController

    def index
        @diseases = Disease.where(name: params["name"])
    end

    def disease_list
        @disease_list = Disease.select(:name).group(:name)
    end

end
