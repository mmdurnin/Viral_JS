class State < ApplicationRecord

    has_many :diseases,
        primary_key: :id,
        foreign_key: :state_id,
        class_name: 'Disease'

    has_many :state_populations,
        primary_key: :id,
        foreign_key: :state_id,
        class_name: 'StatePopulation'
end
