-- Flip existing notification_settings rows so email defaults ON (opt-out).
-- This aligns existing rows with the new DEFAULT TRUE on the column.
UPDATE notification_settings SET email = TRUE WHERE email = FALSE;