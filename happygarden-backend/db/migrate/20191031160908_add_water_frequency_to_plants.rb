class AddWaterFrequencyToPlants < ActiveRecord::Migration[6.0]
  def change
    add_column :plants, :water_frequency, :integer
  end
end
