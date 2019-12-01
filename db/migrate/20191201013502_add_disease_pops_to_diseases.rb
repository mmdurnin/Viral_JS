class AddDiseasePopsToDiseases < ActiveRecord::Migration[5.2]
  def change
    add_column :diseases, :geom, :geometry, limit: {srid: 4326, type: 'multi_point'}

    add_index :diseases, :geom, using: :gist
    execute('CREATE INDEX disease_pop_idx ON states USING GIST((geom::geography))')
  end
end
