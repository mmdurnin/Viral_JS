class Api::StatesController < ApplicationController

    def index
        @states = State.select("id, name, st_asgeojson(geom) AS coordinates")
    end
    
end
