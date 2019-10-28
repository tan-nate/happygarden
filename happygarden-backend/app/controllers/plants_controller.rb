class PlantsController < ApplicationController
    def create
        plant = Plant.create(image_url: params[:imgBase64])
        render json: PokemonSerializer.new(pokemon).to_serialized_json
    end
end