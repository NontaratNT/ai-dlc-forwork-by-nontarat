# 🛡️ Data Privacy & Masking Protocol
มาตรฐานการจัดการข้อมูลสำคัญ เพื่อป้องกันข้อมูลรั่วไหลไปยัง AI Server

## 1. ข้อมูลที่ "ห้าม" ส่งให้ AI แบบ RAW (Sensitive Data)
- **Credentials:** API Keys, Passwords, Secrets, Connection Strings
- **PII:** ชื่อ-นามสกุลจริง, เลขบัตรประชาชน, เบอร์โทรศัพท์ (ที่เป็นข้อมูลจริง)
- **Database:** ข้อมูลลูกค้าหรือข้อมูลธุรกิจจริงใน Production

## 2. มาตรฐานการทำ Masking (The Marking Standard)
ให้ใช้รูปแบบต่อไปนี้ในการระบุข้อมูลสำคัญ:
- **Keys/Tokens:** `{{SECRET_TOKEN}}`
- **PII:** `[MASKED_NAME]`, `[MASKED_PHONE]`
- **Connection Strings:** `Server={{DB_SERVER}};Database={{DB_NAME}};UID={{USER}};PWD={{PASS}};`

## 3. หน้าที่ของ AI
1. **Proactive Alert:** หาก AI พบเห็นข้อมูลที่ดูเหมือนข้อมูลจริง (Sensitive Data) ในแชทหรือในโค้ด ต้องแจ้งเตือน Human ทันทีว่า "พบข้อมูลสุ่มเสี่ยง กรุณาใช้ Masking"
2. **Never Generate Real Data:** ในขั้นตอนการสร้าง Sample Data/Fake Data ห้ามใช้ชื่อหรือข้อมูลที่อ้างอิงถึงบุคคลจริงที่มีตัวตน
3. **External Config:** บังคับใช้ `.env` หรือ `Secrets Manager` สำหรับข้อมูลความลับเสมอ
