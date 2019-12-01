class AddPointsToDiseases < ActiveRecord::Migration[5.2]
  def change
    add_column :diseases, :points, :integer
  end
end
