class CreateDiseases < ActiveRecord::Migration[5.2]
  def change
    create_table :diseases do |t|
      t.integer :state_id, null: false
      t.string :name, null: false
      t.decimal :rate
      t.integer :year, null: false

      t.timestamps
    end
    add_index :diseases, [:state_id, :name, :rate, :year], unique: true
    add_index :diseases, :state_id
    add_index :diseases, :name
    add_index :diseases, :year
  end
end
