class PlantsController < ApplicationController
    def create
        plant = Plant.create(image_url: params[:imgBase64])
        render json: PlantSerializer.new(plant).to_serialized_json
    end
end