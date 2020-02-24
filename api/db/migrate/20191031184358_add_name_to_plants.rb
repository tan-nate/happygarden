class AddNameToPlants < ActiveRecord::Migration[6.0]
  def change
    add_column :plants, :name, :string
  end
end
