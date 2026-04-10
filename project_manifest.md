project_name: "[ชื่อโปรเจกต์ใหม่]"
project_scale: "Enterprise" # ระดับความเข้มงวด: Small (เร็ว/ข้ามTestได้), Medium, Enterprise (ห้ามข้ามขั้นตอน/ข้ามTest)
version: "1.0.0"
global_directive: "ปฏิบัติตาม CORE DIRECTIVE FOR AI-AUGMENTED SDLC อย่างเคร่งครัด"
tech_stack:
  frontend: "Angular (Strict Mode)"
  backend: ".NET Core (REST API)"
  database: "PostgreSQL / SQL Server"
  infrastructure: "Docker"
environments:
  - "DEV: ตัดฐานข้อมูลเริ่มต้น, ทำ Fake Data"
  - "UAT: ทดสอบเสมือนจริง, ซ่อน PII Data"
  - "PROD: Strict Security, Caching Enabled"
security_standard: "OWASP Top 10 Active Prevention"
ui_standards:
  - "Auto-reset form & show toast on success (HTTP 20x)"
  - "Always refetch list on view return, retain pagination/filters"
  - "Debounce search inputs (300ms)"