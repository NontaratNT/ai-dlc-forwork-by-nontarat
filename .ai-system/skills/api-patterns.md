# 🛠️ Skill: API Development & Integration
**Description:** มาตรฐานวิศวกรรมสำหรับการสร้างและเชื่อมต่อ API
**Standards:** RESTful Principles, SOLID, Open-API Compliant
**Tooling:** .NET Core, JWT, Swagger

---

## 📐 1. Integration Standards
- **Contract-First:** ออกแบบ Response/Request Object ก่อนเขียนโค้ด
- **Consistent Wrapper:** ใช้โครงสร้าง Return แบบ `success/data/message`
- **DI Implementation:** บังคับใช้ Repository Pattern ในการจัดการ Data Access

## 🔒 2. Security Integration
- ทุก Endpoint ที่เป็น `WRITE` ต้องถูกคุ้มครองด้วยการตรวจสอบสิทธิ์
- มีการทำ Data Validation ในระดับ Model เสมอ
