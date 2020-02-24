class CommentsController < ApplicationController
    def create
        comment = Comment.create(content: params[:content], plant_id: params[:plant_id])
    end
end
