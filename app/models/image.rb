class Image < ActiveRecord::Base
  has_one :hocr_layer


  # the high quality files will be somewhere locally, pass in this path
  # this method will run tesseract and save hocr and ocr files in public
  def self.run_ocrs(path)
    img_filenames = Dir.new(path).entries.select do |f|
      !File.directory?(f) && !f.start_with?(".")
    end
    img_filenames.each do |file|
      system "tesseract #{File.join(path, file)} #{Rails.public_path}/ocr_files/#{file[0..-5]}_ocr -l eng"
      system "tesseract #{File.join(path, file)} #{Rails.public_path.to_s[0..-7]}app/views/hocr_files/_p#{file[0..-5]}_hocr -l eng hocr"
      system "mv #{Rails.public_path.to_s[0..-7]}app/views/hocr_files/_p#{file[0..-5]}_hocr.html #{Rails.public_path.to_s[0..-7]}app/views/hocr_files/_p#{file[0..-5]}_hocr.html.erb"
    end
  end

  # before this happens we need to run a script to crop all the images
  # and create 1/5th sized versions to store in public folder
  def self.create_images
    #Parse through all image files (1/5th versions)
    #Create hocr_layer associations <-- can't happen before create_hocr_objects is run (hocr_layer.rb)
  end

end