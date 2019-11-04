class CommentsController < ApplicationController
    def create
        binding.pry
        comment = Comment.create(content: params[:content], plant_id: params[:plant_id])
        render json: PlantSerializer.new(plant).to_serialized_json
    end
end
