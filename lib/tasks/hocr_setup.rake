
desc "Crop tifs"
task :crop_images do
end

desc "Make 1/4th size jpegs from cropped tifs and store in public/page_images"
task :store_images do
end

desc "prepare image files for ocr"
task :prepare_images => [:crop_images, :store_images]

desc "create hocr and ocr files, saves them in app/views/hocr_files and public/ocr_files respectively"
task :run_ocrs, [:path] => [:environment] do |t, args|
  puts "running ocr"
  Image.run_ocrs(args[:path])
end

desc "create hocr_layer objects in database and modify files"
task :hocr_objects => :environment do
  puts "creating hocr objects"
  HocrLayer.create_hocr_objects
end

desc "identifies start of a claim and creates new claim object for each record number"
task :claim_objects => :environment do
  puts "creating claim objects"
  HocrLayer.identify_claims
end

desc "create hocr and ocr files: run locally"
task :ocr, [:path] => [:environment, :run_ocrs]

desc "fill database: run on heroku"
task :database_objects => [:environment, :hocr_objects, :claim_objects]


