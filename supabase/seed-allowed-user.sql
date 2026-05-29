-- 본인 이메일 1명 등록 (Magic Link로 로그인할 주소와 동일해야 함)
-- 이메일·이름만 수정한 뒤 SQL Editor에서 Run

INSERT INTO allowed_users (email, name, is_approved, role)
VALUES (
    '본인@이메일.com',   -- ← 여기 수정
    '홍길동',            -- ← 표시 이름 (아무거나)
    true,
    'user'
)
ON CONFLICT (email) DO UPDATE SET
    is_approved = EXCLUDED.is_approved,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
