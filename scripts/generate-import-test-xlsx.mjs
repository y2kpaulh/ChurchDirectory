/**
 * 엑셀 가져오기 테스트용 샘플 파일 생성
 * 실행: node scripts/generate-import-test-xlsx.mjs
 */
import * as XLSX from 'xlsx/xlsx.mjs'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../supabase/fixtures')
const outPath = join(outDir, 'import-test-members.xlsx')

const headers = ['이름', '전화', '업종', '회사명', '직함', '업무설명', 'URL', '소속Cell', '기타', '공개']

/** schema.sql 초기 카테고리와 동일한 이름 사용 */
const rows = [
  {
    이름: '가져오기테스트_김성도',
    전화: '010-9001-0001',
    업종: '외식/베이커리',
    회사명: '샘플 베이커리',
    직함: '대표',
    업무설명: '케이크·빵 주문 제작',
    URL: 'https://example.com/bakery',
    소속Cell: '청년부 3셀',
    기타: '주문 2일 전 연락',
    공개: 'Y',
  },
  {
    이름: '가져오기테스트_이성도',
    전화: '010-9001-0002',
    업종: 'IT/기술',
    회사명: '샘플 소프트',
    직함: '개발자',
    업무설명: '웹·앱 유지보수',
    URL: 'example.com/it',
    소속Cell: '장년부 1셀',
    기타: '',
    공개: '예',
  },
  {
    이름: '가져오기테스트_박성도',
    전화: '010-9001-0003',
    업종: '교육/학원',
    회사명: '샘플 학원',
    직함: '원장',
    업무설명: '초등 수학·영어',
    URL: '',
    소속Cell: '유초등부 부모셀',
    기타: '방문 상담 환영',
    공개: 'Y',
  },
  {
    이름: '가져오기테스트_최성도',
    전화: '010-9001-0004',
    업종: '의료/보건',
    회사명: '샘플 클리닉',
    직함: '간호사',
    업무설명: '가정간호 상담',
    URL: 'https://example.com/clinic',
    소속Cell: '',
    기타: '',
    공개: 'N',
  },
]

const sheet = XLSX.utils.json_to_sheet(rows, { header: headers })
const book = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(book, sheet, 'church_members')
mkdirSync(outDir, { recursive: true })
writeFileSync(outPath, XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }))

console.log('Wrote', outPath)
