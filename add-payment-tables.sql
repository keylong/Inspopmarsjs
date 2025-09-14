-- 添加支付相关表的增量迁移
-- 只创建新表，不影响现有数据

-- 1. 订阅套餐表
CREATE TABLE IF NOT EXISTS "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "name_en" VARCHAR(100),
    "description" TEXT NOT NULL,
    "description_en" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'CNY',
    "duration" VARCHAR(20) NOT NULL,
    "features" JSONB NOT NULL,
    "features_en" JSONB,
    "download_limit" INTEGER NOT NULL,
    "stripe_product_id" VARCHAR(100),
    "stripe_price_id" VARCHAR(100),
    "alipay_product_id" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- 2. 用户订阅表
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "payment_method" VARCHAR(20) NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- 3. 支付订单表
CREATE TABLE IF NOT EXISTS "payment_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'CNY',
    "payment_method" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "payment_intent_id" VARCHAR(200),
    "alipay_trade_no" VARCHAR(200),
    "metadata" JSONB,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_orders_pkey" PRIMARY KEY ("id")
);

-- 4. 使用统计表
CREATE TABLE IF NOT EXISTS "usage_stats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "last_reset_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_stats_pkey" PRIMARY KEY ("id")
);

-- 添加外键约束
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "usage_stats" ADD CONSTRAINT "usage_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "usage_stats" ADD CONSTRAINT "usage_stats_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "user_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 添加唯一约束
ALTER TABLE "usage_stats" ADD CONSTRAINT "usage_stats_user_id_subscription_id_key" UNIQUE ("user_id", "subscription_id");

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS "user_subscriptions_user_id_idx" ON "user_subscriptions"("user_id");
CREATE INDEX IF NOT EXISTS "user_subscriptions_status_idx" ON "user_subscriptions"("status");
CREATE INDEX IF NOT EXISTS "payment_orders_user_id_idx" ON "payment_orders"("user_id");
CREATE INDEX IF NOT EXISTS "payment_orders_status_idx" ON "payment_orders"("status");
CREATE INDEX IF NOT EXISTS "subscription_plans_is_active_idx" ON "subscription_plans"("is_active");