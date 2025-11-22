# 프로젝트 구매 API 에러 응답 명세서

## POST /api/users/projects/{project-id}/purchase - 프로젝트 구매

### **Header**

```json
{
  "Authorization": "Bearer {access_token}"
}
```

### **Request**

```json
{
  "price": 8888
}
```

### Request Body 필드

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| price | number | ✅ | 구매 가격 (양수 정수) |

### **Response**

#### ✅ 성공 응답 (200)

```json
{
  "success": true,
  "code": 200,
  "message": "구매 이력 추가 완료",
  "data": {
    "user": {
      "purchase_id": 1111,
      "user_id": 1024,
      "project_id": 123,
      "created_date": "2024-01-10T10:30:00Z",
      "name": "ㅇㅇㅇ",
      "nickname": "ㅇㅇㅇㅇ",
      "email": "ㅇㅇ@dgu.co.kr",
      "money": 7777,
      "created_at": "2024-01-10T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### ❌ 에러 응답

#### 1. 인증 토큰 없음 (401)

**상황**: Authorization 헤더가 없거나 유효하지 않은 토큰인 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 401,
  "message": "User authentication required",
  "data": {}
}
```

#### 2. project-id 파라미터 누락 (400)

**상황**: URL에 project-id 파라미터가 없는 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "projectId parameter is required",
  "data": {}
}
```

#### 3. 잘못된 project-id 형식 (400)

**상황**: project-id가 숫자가 아니거나 0 이하인 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Invalid projectId: must be a positive integer",
  "data": {}
}
```

#### 4. project-id가 너무 큰 경우 (400)

**상황**: project-id가 Number.MAX_SAFE_INTEGER를 초과하는 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Invalid projectId: number is too large",
  "data": {}
}
```

#### 5. 잘못된 요청 body (400)

**상황**: 요청 body가 객체가 아니거나 형식이 잘못된 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Invalid request body",
  "data": {}
}
```

#### 6. price 필드 누락 (400)

**상황**: 요청 body에 `price` 필드가 없는 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "price field is required",
  "data": {}
}
```

#### 7. 잘못된 price 형식 (400)

**상황**: price가 숫자가 아니거나 0 이하인 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Invalid price: must be a positive integer",
  "data": {}
}
```

#### 8. 존재하지 않는 유저 (404)

**상황**: 인증된 유저가 데이터베이스에 존재하지 않는 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 404,
  "message": "User not found",
  "data": {}
}
```

#### 9. 존재하지 않는 프로젝트 (404)

**상황**: 요청한 project-id에 해당하는 프로젝트가 존재하지 않는 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 404,
  "message": "Project not found",
  "data": {}
}
```

#### 10. 잔액 부족 (400)

**상황**: 현재 유저의 money가 price보다 적은 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Insufficient funds",
  "data": {}
}
```

#### 11. 이미 구매한 프로젝트 (400)

**상황**: 해당 유저가 이미 해당 프로젝트를 구매한 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Project already purchased",
  "data": {}
}
```

#### 12. 구매 실패 (400)

**상황**: 예상치 못한 에러로 구매가 실패한 경우

**Response JSON**:
```json
{
  "success": false,
  "code": 400,
  "message": "Purchase failed",
  "data": {}
}
```

---

## 에러 코드 요약

| HTTP 상태 코드 | 에러 메시지 | 발생 조건 |
|---------------|------------|----------|
| 401 | User authentication required | Authorization 헤더 없음 또는 유효하지 않은 토큰 |
| 400 | projectId parameter is required | project-id 파라미터 없음 |
| 400 | Invalid projectId: must be a positive integer | project-id가 유효하지 않음 |
| 400 | Invalid projectId: number is too large | project-id가 너무 큼 |
| 400 | Invalid request body | 요청 body가 객체가 아님 |
| 400 | price field is required | price 필드가 없음 |
| 400 | Invalid price: must be a positive integer | price가 유효하지 않음 |
| 400 | Insufficient funds | 현재 money가 price보다 적음 |
| 400 | Project already purchased | 이미 구매한 프로젝트를 다시 구매하려고 함 |
| 400 | Purchase failed | 예상치 못한 구매 실패 |
| 404 | User not found | 유저가 존재하지 않음 |
| 404 | Project not found | 프로젝트가 존재하지 않음 |

## 참고사항

- **500 에러는 발생하지 않습니다**: 모든 예상치 못한 에러는 400 또는 404 에러로 변환됩니다.
- 모든 에러 응답은 동일한 형식을 따릅니다: `{ success: false, code: number, message: string, data: {} }`
- 개발 환경에서는 `stack` 필드가 추가로 포함될 수 있습니다.
- 구매는 트랜잭션으로 처리되어, money 차감과 구매 이력 생성이 원자적으로 수행됩니다.
- 구매 후 반환되는 `money`는 차감된 후의 금액입니다.
- **중복 구매 방지**: 같은 유저가 같은 프로젝트를 두 번 구매할 수 없습니다.

