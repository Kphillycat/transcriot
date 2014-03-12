class AddColumnOverchargeClaims < ActiveRecord::Migration
  def change
    add_column :claims, :overcharge?, :boolean
  end
end
