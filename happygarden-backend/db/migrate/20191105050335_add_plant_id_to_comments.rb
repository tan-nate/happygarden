class AddPlantIdToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :plant_id, :integer
  end
end
