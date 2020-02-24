class AddNotesToPlants < ActiveRecord::Migration[6.0]
  def change
    add_column :plants, :notes, :string
  end
end
