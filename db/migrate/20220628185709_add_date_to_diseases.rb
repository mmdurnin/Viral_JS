class AddDateToDiseases < ActiveRecord::Migration[5.2]
  def change
    add_column :diseases, :submission_date, :datetime
    add_index :diseases, :submission_date
  end
end
