class AddColumnClaimAffidavit < ActiveRecord::Migration
  def change
    add_column :claims, :affidavit, :text
  end
end
