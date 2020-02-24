class AddIncludeTagToPlants < ActiveRecord::Migration[6.0]
  def change
    add_column :plants, :include_tag, :boolean
  end
end
