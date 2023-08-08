ALTER TABLE 
    "test_db"."public"."employees" ADD COLUMN deleted BOOLEAN;
ALTER TABLE 
    "test_db"."public"."employees" ALTER COLUMN "deleted" SET DEFAULT false;
ALTER TABLE 
    "test_db"."public"."employees" ALTER COLUMN "deleted" SET NOT NULL;