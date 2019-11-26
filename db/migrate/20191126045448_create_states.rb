class CreateStates < ActiveRecord::Migration[5.2]
  def change
    create_table :states do |t|
      t.string :name, unique: true, null: false
      t.geometry :geom, limit: {srid: 4326, type: 'multi_polygon'}
      t.timestamps
    end
    add_index :states, :name
    add_index :states, :geom, using: :gist
    execute('CREATE INDEX state_coords_idx ON states USING GIST((geom::geography))')
  end
end
