import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756371217747 implements MigrationInterface {
    name = 'Migration1756371217747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('FUND', 'WITHDRAW', 'TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'completed', 'failed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."transactions_type_enum" NOT NULL, "amount" numeric(15,2) NOT NULL, "description" character varying NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "reference" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "walletId" uuid, CONSTRAINT "UQ_dd85cc865e0c3d5d4be095d3f3f" UNIQUE ("reference"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended', 'pending', 'banned')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "password_reset_token" character varying, "password_reset_expires_at" TIMESTAMP, "phone_number" character varying, "bvn" character varying, "bvn_dob" character varying, "otp" character varying, "email_verification_token" character varying, "email_verification_expires_at" TIMESTAMP, "verified_at" TIMESTAMP, "status" "public"."users_status_enum" NOT NULL DEFAULT 'inactive', "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "walletId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_0a95e6aab86ff1b0278c18cf48" UNIQUE ("walletId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "wallet_reference" character varying NOT NULL, "wallet_name" character varying NOT NULL, "account_number" character varying NOT NULL, "account_name" character varying NOT NULL, "top_up_account_details" jsonb, "customer_email" character varying NOT NULL, "bvn" character varying, "bvn_dob" character varying, "balance" numeric(15,2) NOT NULL DEFAULT '0', "total_earned" numeric(15,2) NOT NULL DEFAULT '0', "total_spent" numeric(15,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_24708330e49f46541a816583e88" UNIQUE ("wallet_reference"), CONSTRAINT "REL_2ecdb33f23e9a6fc392025c0b9" UNIQUE ("userId"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."services_category_enum" AS ENUM('airtime', 'data', 'cable_tv', 'electricity', 'other')`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category" "public"."services_category_enum" NOT NULL DEFAULT 'other', "provider_name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."referrals_status_enum" AS ENUM('pending', 'paid')`);
        await queryRunner.query(`CREATE TABLE "referrals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bonus_amount" numeric(18,2) NOT NULL DEFAULT '0', "status" "public"."referrals_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "referrer_id" uuid, "referred_id" uuid, CONSTRAINT "PK_ea9980e34f738b6252817326c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "networks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "logo_url" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61b1ee921bf79550d9d4742b9f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f820172634ddbb5fd48463cb71" ON "networks" ("code") `);
        await queryRunner.query(`CREATE TYPE "public"."fraud_alerts_alert_type_enum" AS ENUM('suspicious_activity', 'high_volume', 'failed_attempts')`);
        await queryRunner.query(`CREATE TYPE "public"."fraud_alerts_severity_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TYPE "public"."fraud_alerts_status_enum" AS ENUM('open', 'investigating', 'resolved')`);
        await queryRunner.query(`CREATE TABLE "fraud_alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alert_type" "public"."fraud_alerts_alert_type_enum" NOT NULL, "severity" "public"."fraud_alerts_severity_enum" NOT NULL DEFAULT 'low', "status" "public"."fraud_alerts_status_enum" NOT NULL DEFAULT 'open', "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "transaction_id" uuid, CONSTRAINT "PK_d1e5b58078239461d43d906f08e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c72bbae371a8bc163f38745afd" ON "fraud_alerts" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_50f36ef831e70c30b6e14f47d8" ON "fraud_alerts" ("transaction_id") `);
        await queryRunner.query(`CREATE TABLE "exchange_rates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" numeric(6,2) NOT NULL, "min_amount" numeric(18,2) NOT NULL, "max_amount" numeric(18,2) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "network_id" uuid, CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bill_payments_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "bill_payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" character varying NOT NULL, "amount" numeric(18,2) NOT NULL, "status" "public"."bill_payments_status_enum" NOT NULL DEFAULT 'pending', "provider_reference" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "transaction_id" uuid, "service_id" uuid, CONSTRAINT "REL_a8efb5c606ae5405a106e1f234" UNIQUE ("transaction_id"), CONSTRAINT "PK_e623f0872b8b5d875f6e3dd3af1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a502c55e13841ecf0d6d873e3" ON "bill_payments" ("provider_reference") `);
        await queryRunner.query(`CREATE TYPE "public"."airtime_orders_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "airtime_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying NOT NULL, "amount" numeric(18,2) NOT NULL, "status" "public"."airtime_orders_status_enum" NOT NULL DEFAULT 'pending', "provider_reference" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "transaction_id" uuid, "network_id" uuid, CONSTRAINT "REL_7b2cddeec97150878dd1e5584e" UNIQUE ("transaction_id"), CONSTRAINT "PK_d81777d5781af0d03ef58743923" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb94a2e6f4942e76e6a40b26f4" ON "airtime_orders" ("provider_reference") `);
        await queryRunner.query(`CREATE TYPE "public"."admin_users_role_enum" AS ENUM('super_admin', 'admin', 'support')`);
        await queryRunner.query(`CREATE TABLE "admin_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."admin_users_role_enum" NOT NULL DEFAULT 'support', "permissions" jsonb, "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dcd0c8a4b10af9c986e510b9ec" ON "admin_users" ("email") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_a88f466d39796d3081cf96e1b66" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0a95e6aab86ff1b0278c18cf48e" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_18af9fcaffac6d6d3b28130e149" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referrals" ADD CONSTRAINT "FK_507a2818bf5524662b068c2e81c" FOREIGN KEY ("referred_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fraud_alerts" ADD CONSTRAINT "FK_c72bbae371a8bc163f38745afdc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fraud_alerts" ADD CONSTRAINT "FK_50f36ef831e70c30b6e14f47d8f" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchange_rates" ADD CONSTRAINT "FK_a33dba297b6d3464d58acc6554d" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bill_payments" ADD CONSTRAINT "FK_28e334b6f478f744f74a5f8ad7d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bill_payments" ADD CONSTRAINT "FK_a8efb5c606ae5405a106e1f2346" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bill_payments" ADD CONSTRAINT "FK_f161ee6554781a2334a353bd59c" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airtime_orders" ADD CONSTRAINT "FK_067087138dfa3365d40e59c7096" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airtime_orders" ADD CONSTRAINT "FK_7b2cddeec97150878dd1e5584ea" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "airtime_orders" ADD CONSTRAINT "FK_0c3fb5cc3d1c632cbe8c04856b5" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "airtime_orders" DROP CONSTRAINT "FK_0c3fb5cc3d1c632cbe8c04856b5"`);
        await queryRunner.query(`ALTER TABLE "airtime_orders" DROP CONSTRAINT "FK_7b2cddeec97150878dd1e5584ea"`);
        await queryRunner.query(`ALTER TABLE "airtime_orders" DROP CONSTRAINT "FK_067087138dfa3365d40e59c7096"`);
        await queryRunner.query(`ALTER TABLE "bill_payments" DROP CONSTRAINT "FK_f161ee6554781a2334a353bd59c"`);
        await queryRunner.query(`ALTER TABLE "bill_payments" DROP CONSTRAINT "FK_a8efb5c606ae5405a106e1f2346"`);
        await queryRunner.query(`ALTER TABLE "bill_payments" DROP CONSTRAINT "FK_28e334b6f478f744f74a5f8ad7d"`);
        await queryRunner.query(`ALTER TABLE "exchange_rates" DROP CONSTRAINT "FK_a33dba297b6d3464d58acc6554d"`);
        await queryRunner.query(`ALTER TABLE "fraud_alerts" DROP CONSTRAINT "FK_50f36ef831e70c30b6e14f47d8f"`);
        await queryRunner.query(`ALTER TABLE "fraud_alerts" DROP CONSTRAINT "FK_c72bbae371a8bc163f38745afdc"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_507a2818bf5524662b068c2e81c"`);
        await queryRunner.query(`ALTER TABLE "referrals" DROP CONSTRAINT "FK_18af9fcaffac6d6d3b28130e149"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_2ecdb33f23e9a6fc392025c0b97"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0a95e6aab86ff1b0278c18cf48e"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_a88f466d39796d3081cf96e1b66"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dcd0c8a4b10af9c986e510b9ec"`);
        await queryRunner.query(`DROP TABLE "admin_users"`);
        await queryRunner.query(`DROP TYPE "public"."admin_users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb94a2e6f4942e76e6a40b26f4"`);
        await queryRunner.query(`DROP TABLE "airtime_orders"`);
        await queryRunner.query(`DROP TYPE "public"."airtime_orders_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a502c55e13841ecf0d6d873e3"`);
        await queryRunner.query(`DROP TABLE "bill_payments"`);
        await queryRunner.query(`DROP TYPE "public"."bill_payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "exchange_rates"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_50f36ef831e70c30b6e14f47d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c72bbae371a8bc163f38745afd"`);
        await queryRunner.query(`DROP TABLE "fraud_alerts"`);
        await queryRunner.query(`DROP TYPE "public"."fraud_alerts_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fraud_alerts_severity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."fraud_alerts_alert_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f820172634ddbb5fd48463cb71"`);
        await queryRunner.query(`DROP TABLE "networks"`);
        await queryRunner.query(`DROP TABLE "referrals"`);
        await queryRunner.query(`DROP TYPE "public"."referrals_status_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_category_enum"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    }

}
