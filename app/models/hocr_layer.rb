class HocrLayer < ActiveRecord::Base
  belongs_to :image
  has_many :hocr_lines
  has_many :claim_hocr_layers
  has_many :claims, :through => :claim_hocr_layers

 # create hocr_layer objects in database with filenames
  def self.create_hocr_objects
    puts "creating hocr objects: in the method"
    directory = Dir.new("./app/views/hocr_files").entries.select do |f|
      !File.directory?(f) && !f.start_with?(".")
    end
    directory.each do |file|
      puts "opening file: #{file}"
      new_layer = HocrLayer.create(:filename => file[2..-11])
      new_layer.modify_file
      puts "wrote to file #{file}"
    end
  end

  # opens hocr_layer file and calls method for modifications
  def modify_file
    file_path = "./app/views/hocr_files/_p#{self.filename}_hocr.html"
    file = File.open(file_path, "r")
    data = file.read
    data = self.replace_bbox(data)
    data = self.add_image(data)
    File.open(file_path, 'w') {|f| f.write(data) }
  end

  # adds inline style coordinates to hocr words
  def replace_bbox(data)
    regex = /(id='word_\d+')\stitle="\w{4}\s+(\d+)\s+(\d+)(\s+\d+){2}"/
    data.gsub(regex) {"#{$1} style='left: #{$2.to_i/4}px\; top: #{$3.to_i/4}px\;'"}
  end

  # links site version of image at the top of the hocr_layer file
  def add_image(data)
    regex = /(?<=ppageno\s0'>)/
    data.gsub(regex) {"\n<img src='/page_images/#{self.filename}.jpg'>"}
  end

  # identifies start of a claim and creates new claim object for each record number
  def self.identify_claims
    current_claim = nil
    self.all.each do |hocr_layer|
      file = File.open("#{Rails.root}/public/ocr_files/#{hocr_layer.filename}_ocr.txt", "r")
      data = file.read
      record_info = /.*\(Record\sNo.\s(\d+),\sof\s1863\.\).*/.match(data)
      # report_info = //.match(data)
      if record_info
        if /.*REPORT.*\(Record\sNo.\s(\d+),\sof\s1863\.\).*/m.match(data)
          hocr_layer.link_claim(current_claim)
          current_claim.populate(data)
        end
        # this is the start of a claim
        current_record = record_info[1].to_i
        current_claim = Claim.create(:record_number => current_record)
      end
      if current_claim
        hocr_layer.link_claim(current_claim)
        current_claim.populate(data)
      end
    end
  end

  # create association between hocr_layer and claim if it doesn't already exist
  def link_claim(claim)
    if !self.claims.include? claim
      self.claims << claim
    end
    self.save
  end

end

class String

  def name_caps
    array = []
    self.downcase!.split(" ").map {|name| array<<name[0].upcase+name[1..-1]}
    array.join(" ")
  end

end
