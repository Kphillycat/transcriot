class ClaimsController < ApplicationController

	def index
	
	end

	# def show
	# 	@claim = Claim.find(params[:id])
 #    respond_to do |format|
 #      format.html
 #      format.json do
 #        render(:json => @claim.to_json(:include => [:people, :damages, :examiners]))
 #      end
 #    end
 #    # render 'diagnostics'
	# end

	def edit
		@claim = Claim.find(params[:id]) 
    @claim = Claim.create if @claim.nil?
  end

  def update
    claim = Claim.find(params[:id]) 
    claim.update_attributes(claim_params)
    claim.update_claimant(claimant_params)
    claim.update_people(affidavit_params, testimony_params)
    claim.update_examiner(examiner_params)
    claim.update_damages(damages_params)
    claim.update_page_numbers(params["page"]["start_page_number"])

    redirect_to :controller=>'claims', :action => 'edit', :id => claim.id
  end

  def claim_params
    params.require(:claim).permit(:claim_date, :incident_date, :resolution_date, :claim_number, :record_number, :incident_address, :incident_address_type, :total_claimed, :total_awarded, :examiners)
  end

  def claimant_params
    params.require(:people).require(:claimant).permit(:name, :previous_address, :current_address, :role, :gender, :race, :claim_id)
  end

  def affidavit_params
    params.require(:people).permit(:affidavit => [:name, :role])
  end

  def testimony_params
    params.require(:people).permit(:testimony => [:name, :role])
  end

  def examiner_params
    params.permit(:examiners => [:name])
  end

  def damages_params
    params.permit(:damages => [:description, :quantity, :unit, :total_cost])
  end
end
