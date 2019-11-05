class PlantSerializer
    def initialize(plant_object)
        @plant = plant_object
    end
    def to_serialized_json
        options = {
            except: [:created_at, :updated_at]
        }
        @plant.to_json(options)
    end
    def to_serialized_json_for_show_action_to_show_comments
        options = {
            methods: :last_3_comments,
            except: [:created_at, :updated_at]
        }
        @plant.to_json(options)
    end
end