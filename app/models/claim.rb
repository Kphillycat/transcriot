  class Claim < ActiveRecord::Base
  # attr_accessible :claim_date, :incident_date, :resolution_date, :claim_number, :record_number, :incident_address, :incident_address_type, :total_claimed, :total_awarded

  has_many :people
  has_many :claim_examiners
  has_many :examiners, :through => :claim_examiners
  has_many :damages
  has_many :claim_hocr_layers
  has_many :hocr_layers, :through => :claim_hocr_layers

  validates :incident_address_type,
    :inclusion => { :in => ["Home", "Workplace", "Other", "", nil],
    :message => "%{value} is not one of the stated options of home, workplace, or other."}

  def claimant
    Person.where(:claim_id=>self.id, :role=>"claimant").first
  end

  def claimant_attr(attribute)
    self.claimant.send(attribute.to_sym) if self.claimant
  end

  def update_claimant(person_params)
    person = self.claimant
    if person
      person.update_attributes(person_params)
    else
      person = Person.create(person_params)
    end
  end

  def update_examiner(examiner_params)
    unless examiner_params[:id].to_i == 0
      examiner = Examiner.find(examiner_params[:id])
      examiner.update_attributes(examiner_params)
      examiner.claims << self unless self.examiners.include? examiner
    else
      examiner = Examiner.new(examiner_params)
      examiner.claims << self
    end
    examiner.save
  end

  def first_examiner_attr(attribute)
    self.examiners.first.send(attribute.to_sym) if self.examiners.first
  end

  # populates claim info in database
  def populate(data)
    # populate claim data via regex on hocr_layer
    self.claimant_name(data)
    self.damages(data)
    self.save
  end

  def claimant_name(data)
    # grab name
    claimant = /.*CLAIM\sOF\s(\w+\s+\w+)\.\W*\(Record\sNo\.\s\d+,\sof\s1863\.\).*/.match(data)
    if claimant
      self.people << Person.create(:name => claimant[1].name_caps, :role => "claimant")
    end
  end

  def damages(data)
    damages = /(?<=\n)([^\n\.)]+)[\.\s]+(\$?\d+\s\d+)(?=\n)/.scan(data)
    damages.each do |damage|
      self.damages << Damage.create(description: damage[0], total_cost: damage[1])
    end
  end


end