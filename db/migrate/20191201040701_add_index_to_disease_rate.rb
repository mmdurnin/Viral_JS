class AddIndexToDiseaseRate < ActiveRecord::Migration[5.2]
  def change

    add_index :diseases, :rate
  end
end
