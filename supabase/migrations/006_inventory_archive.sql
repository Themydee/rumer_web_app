-- Allow inventory items to be archived
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;
ALTER TABLE inventory ADD CONSTRAINT inventory_status_check
    CHECK (status IN ('available', 'reserved', 'sold', 'archived'));
