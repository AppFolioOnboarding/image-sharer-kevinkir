class CreateFeedbacks < ActiveRecord::Migration[5.2]
  def change
    create_table :feedbacks do |t|
      t.string :username, null: false
      t.text :comments, null: false

      t.timestamps
    end
  end
end
