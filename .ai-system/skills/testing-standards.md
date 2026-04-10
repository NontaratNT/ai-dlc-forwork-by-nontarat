# 🧪 Skill: Testing & Quality Assurance
มาตรฐานการควบคุมคุณภาพ สำหรับโปรเจกต์ระดับ Enterprise

## 1. Unit Testing (Backend)
- **Framework:** `xUnit` + `Moq` (สำหรับ .NET)
- **กฎเหล็ก:** ทุก Business Logic ใน Services ไดเรกทอรี ต้องมี Test Coverage อย่างน้อย 80%
- AI จะต้องสร้างไฟล์ `[ServiceName]Tests.cs` ควบคู่กับการสร้าง Service ใหม่เสมอเมื่อ Project Scale เป็น "Enterprise"

## 2. UI Component Testing (Frontend)
- เคารพความเป็น `Isolated Component`
- ตรวจสอบ Input/Output (Event Emitters) ของ UI

## 3. การหลีกเลี่ยง Flaky Tests
- ห้ามพึ่งพา Environment จริงในการเขียน Test
- ต้องใช้ Mocking สำหรับ External API, Database, และ Time/Date เสมอ
