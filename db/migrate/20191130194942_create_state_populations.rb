class CreateStatePopulations < ActiveRecord::Migration[5.2]
  def change
    create_table :state_populations do |t|
      t.integer :state_id
      t.integer :population
      t.integer :year

      t.timestamps
    end

    add_index :state_populations, [:state_id, :population, :year], unique: true
    add_index :state_populations, :state_id
    add_index :state_populations, :population
    add_index :state_populations, :year
  end
end
