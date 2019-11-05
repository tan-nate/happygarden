class PlantsController < ApplicationController
    def create
        plant = Plant.create(image_url: params[:imgBase64], include_tag: params[:includeTag], water_frequency: params[:waterFrequency], notes: params[:notes], name: params[:name])
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
end