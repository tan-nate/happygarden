class RemoveWaterFrequencyFromPlants < ActiveRecord::Migration[6.0]
  def change
    remove_column :plants, :water_frequency, :integer
  end
end
