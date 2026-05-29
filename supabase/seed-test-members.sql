-- (선택) CSV 없이 목록 화면 테스트용 샘플 데이터
-- schema.sql 실행 후, 필요할 때만 실행

INSERT INTO church_members (
    name, phone, category_id, company_name, job_title,
    business_description, is_public
) VALUES
(
    '김목사', '010-1234-5678', 1,
    '은혜 베이커리', '대표',
    '교회 인근 수제 빵·케이크 제작', true
),
(
    '이집사', '010-2345-6789', 2,
    '바른 IT', '개발팀장',
    '웹·앱 개발, 교회 홈페이지 구축', true
),
(
    '박권사', '010-3456-7890', 3,
    '새힘 학원', '원장',
    '초등 수학·영어 과외', true
);
