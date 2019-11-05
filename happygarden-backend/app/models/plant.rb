class Plant < ApplicationRecord
    has_many :comments

    def last_3_comments
        self.comments.most_recent.limit(3).reverse
    end
end
