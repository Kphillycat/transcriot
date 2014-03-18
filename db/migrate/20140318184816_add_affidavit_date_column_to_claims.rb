class AddAffidavitDateColumnToClaims < ActiveRecord::Migration
  def change
    add_column :claims, :affidavit_date, :integer
  end
end
