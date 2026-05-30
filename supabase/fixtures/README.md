# 엑셀 가져오기 테스트

## 파일

| 파일 | 설명 |
|------|------|
| [import-test-members.xlsx](./import-test-members.xlsx) | 관리자 **엑셀 가져오기**용 샘플 (4행) |

## 사용 방법

1. Supabase에 `schema.sql` 초기 카테고리가 있어야 합니다.  
   (`외식/베이커리`, `IT/기술`, `교육/학원`, `의료/보건`)
2. 관리자 로그인 → `/admin` → **엑셀 가져오기** → 이 파일 선택
3. 성공 시 4건 추가, 이름은 `가져오기테스트_*` 로 구분됩니다.

## 다시 만들기

```bash
node scripts/generate-import-test-xlsx.mjs
```

## 열 순서

이름, 전화, 업종, 회사명, 직함, 업무설명, URL, 소속Cell, 기타, 공개
