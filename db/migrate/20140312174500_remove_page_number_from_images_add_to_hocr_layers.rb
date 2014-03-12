class RemovePageNumberFromImagesAddToHocrLayers < ActiveRecord::Migration
  def up
    remove_column :images, :page_number 
    add_column :hocr_layers, :page_number, :integer
  end

  def down
    add_column :images, :page_number, :integer 
    remove_column :hocr_layers, :page_number
  end
end
