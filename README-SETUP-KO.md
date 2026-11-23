# ENFPATH 사이트 업데이트 / 관리자 기능 설정

## 포함된 변경
- 메인 페이지 중앙 정렬, 상세 페이지 좌측 제목 + 우측 콘텐츠 레이아웃
- 관리자 로그인: 비밀 코드는 서버 환경 변수 `ADMIN_CODE`에서만 읽음
- 임시 저장 / 게시 / 수정 / 삭제
- 관리자 전용 이미지 업로드 (최대 8MB)
- 콘텐츠는 Supabase Database에 저장되고 공개 게시물은 각 상세 페이지에 표시됨

## 배포 전 설정 (필수)
이 프로젝트는 정적 HTML만으로 관리자 기능을 안전하게 제공할 수 없으므로 Vercel Functions와 Supabase가 필요합니다.

1. Supabase 프로젝트를 만든 뒤 SQL Editor에서 `supabase-schema.sql` 전체를 실행합니다.
2. Supabase Storage에서 `enfpath-media` 이름의 버킷을 만들고 Public으로 설정합니다.
3. Supabase Project Settings > API에서 Project URL과 `service_role` 키를 확인합니다. 이 키는 절대 HTML/JS에 넣거나 공개하지 마세요.
4. Vercel 프로젝트 Settings > Environment Variables에 아래 값을 등록합니다.
   - `ADMIN_CODE`: 직접 정한 충분히 긴 비밀 코드
   - `SESSION_SECRET`: 충분히 긴 무작위 문자열 (다른 서비스와 공유하지 않기)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` = `enfpath-media`
5. 환경 변수를 저장한 뒤 Vercel에서 Redeploy 합니다.
6. 사이트 주소 뒤에 `/admin.html`을 열어 관리자 로그인합니다.

## GitHub에 반영
압축을 풀고 기존 저장소의 파일을 교체/추가한 뒤 커밋하고 push하세요. 먼저 새 브랜치에 올려 Preview Deployment에서 확인하고, 정상 작동을 확인한 다음 main에 병합하는 것을 권장합니다.

## 참고
- 관리자 비밀 코드는 채팅이나 GitHub에 올리지 마세요.
- `service_role` 키도 GitHub에 올리지 마세요.
- 게시물과 이미지는 Supabase에 저장됩니다. HTML 파일을 수정하지 않아도 관리자 화면에서 콘텐츠를 추가할 수 있습니다.
- 현재 구현은 기본적인 단일 관리자 운영용입니다. 로그인 시도 제한, 백업, 다중 관리자 권한은 별도 강화가 필요합니다.
