-- 创建签到记录表
CREATE TABLE IF NOT EXISTS checkin_records (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL,
    checkin_date DATE NOT NULL,
    reward INTEGER NOT NULL,
    consecutive_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_checkin_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_date 
        UNIQUE (user_id, checkin_date)
);

-- 创建索引提升查询性能
CREATE INDEX IF NOT EXISTS idx_checkin_user_date ON checkin_records(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_checkin_date ON checkin_records(checkin_date);