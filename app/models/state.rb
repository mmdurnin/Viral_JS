class State < ApplicationRecord

    has_many :diseases,
        primary_key: :id,
        foreign_key: :state_id,
        class_name: 'Disease'
end
