class AddParagraphsClaim < ActiveRecord::Migration
  def change
    add_column :claims, :letter, :text
    add_column :claims, :testimony, :text
    add_column :claims, :report, :text
  end
end
