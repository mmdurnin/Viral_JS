class CreateStatePopulations < ActiveRecord::Migration[5.2]
  def change
    create_table :state_populations do |t|
      t.integer :state_id
      t.integer :population
      t.integer :year
      t.geometry :geom, limit: {srid: 4326, type: 'multi_point'}

      t.timestamps
    end

    add_index :state_populations, [:state_id, :population, :year], unique: true
    add_index :state_populations, :state_id
    add_index :state_populations, :population
    add_index :state_populations, :year
    add_index :state_populations, :geom, using: :gist
    execute('CREATE INDEX disease_rate_idx ON states USING GIST((geom::geography))')
  end
end
