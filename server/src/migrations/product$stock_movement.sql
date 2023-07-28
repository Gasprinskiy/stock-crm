CREATE TABLE public."product$stock_movements" (
    mvmnt_id INTEGER NOT NULL,
    accounting_id INTEGER NOT NULL,
    stock_id INTEGER NOT NULL,
    PRIMARY KEY (mvmnt_id),
    CONSTRAINT productstockmovements_fk1 FOREIGN KEY (accounting_id) REFERENCES
    public."product$stocks" ("accounting_id"),
    CONSTRAINT productstockmovements_fk2 FOREIGN KEY (stock_id) REFERENCES
    public."stocks" ("stock_id")
);

ALTER TABLE
    "test_db"."public"."product$stock_movements" ALTER COLUMN "mvmnt_id" ADD GENERATED ALWAYS AS
    IDENTITY;
ALTER TABLE
    public."product$stock_movements" ADD COLUMN receiving_stock_id INTEGER;
ALTER TABLE
    public."product$stock_movements" ALTER COLUMN receiving_stock_id SET NOT NULL;
ALTER TABLE
    public."product$stock_movements" RENAME COLUMN "stock_id" TO sending_stock_id;
ALTER TABLE
    public."product$stock_movements" DROP CONSTRAINT "productstockmovements_fk2";
ALTER TABLE
    public."product$stock_movements" ADD CONSTRAINT productstockmovements_fk2 FOREIGN
    KEY (sending_stock_id) REFERENCES public."stocks" ("stock_id");
ALTER TABLE
    public."product$stock_movements" ADD CONSTRAINT productstockmovements_fk3 FOREIGN
    KEY (receiving_stock_id) REFERENCES public."stocks" ("stock_id");
ALTER TABLE
    "test_db"."public"."product$stock_movements" ADD COLUMN amount INTEGER;
ALTER TABLE
    "test_db"."public"."product$stock_movements" ALTER COLUMN amount SET NOT NULL;
ALTER TABLE
    public."product$stock_movements" ADD COLUMN recevied BOOLEAN;
ALTER TABLE
    public."product$stock_movements" ALTER COLUMN recevied SET NOT NULL;
ALTER TABLE
    public."product$stock_movements" ALTER COLUMN recevied SET DEFAULT false;
ALTER TABLE
    "test_db"."public"."product$stock_movements" DROP COLUMN "sending_stock_id";
