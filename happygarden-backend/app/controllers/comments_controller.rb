class CommentsController < ApplicationController
    def create
        comment = Comment.create(content: params[:content], plant_id: params[:plant_id])
    end

    def show
        comment = Comment.find(params[:id])
        render json: CommentSerializer.new(comment).to_serialized_json
    end
end
