class ClaimsController < ApplicationController
	def index
		@claims = Claim.all
    # @claims.as_json{:include => :claimant}
    respond_to do |format|
      format.html
      format.json do
        render(:json => @claims.to_json(:include => [:people, :damages, :examiners]))
      end
    end
	end

	def show
		@claim = Claim.find(params[:id])
    respond_to do |format|
      format.html
      format.json do
        render(:json => @claim.to_json(:include => [:people, :damages, :examiners]))
      end
    end
    # render 'diagnostics'
	end

	def edit
		@claim = Claim.find(params[:id]) 
    @claim = Claim.create if @claim.nil?
  end

  def update
    claim = Claim.find(params[:id]) 
    claim.update_attributes(params[:claim])
    claim.update_claimant(person_params)
    claim.update_examiner(examiner_params)
    claim.update_damages(damages_params)

    render 'diagnostics'
  end

  def claim_params
    params.require(:claim).permit(:claim_date, :incident_date, :resolution_date, :claim_number, :record_number, :incident_address, :incident_address_type, :total_claimed, :total_awarded, :examiners)
  end

  def person_params
    params.require(:person).permit(:name, :previous_address, :current_address, :role, :gender, :race, :claim_id)
  end

  def examiner_params
    params.require(:examiner).permit(:id, :name, :claims)
  end

  def damages_params
    params.require(:damages).permit(:description, :quantity, :unit, :total_cost)
  end
end
