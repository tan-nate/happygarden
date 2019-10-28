class PlantsController < ApplicationController
    def index
        plants = Plant.all
        render json: PlantSerializer.new(plants).to_serialized_json
    end
    
    def create
        plant = Plant.create(image_url: params[:imgBase64])
        render json: PlantSerializer.new(plant).to_serialized_json
    end
end