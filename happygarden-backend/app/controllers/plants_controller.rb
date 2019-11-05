class PlantsController < ApplicationController
    def create
        plant = Plant.create(plant_params)
        render json: PlantSerializer.new(plant).to_serialized_json
    end

    def index
        plants = Plant.all
        render json: PlantSerializer.new(plants).to_serialized_json
    end

    def show
        plant = Plant.find(params[:id])
        render json: PlantSerializer.new(plant).to_serialized_json_for_show_action_to_show_comments
    end

    private

    def plant_params
        params.permit(:image_url, :include_tag, :name, :notes)
    end
end