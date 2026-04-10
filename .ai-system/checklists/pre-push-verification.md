# ✅ Checklist: AI Self-Verification
**Description:** รายการตรวจสอบความถูกต้องก่อนส่งมอบงานให้ Human
**Rule:** AI ต้องผ่าน Checklist นี้ 100% ก่อนประกาศว่า "Task Completed"

---

## 🔍 1. Critical Checks
- [ ] (Logic) รองรับเคส Null/Undefined หรือยัง?
- [ ] (Security) ไม่มีการหลุดของ API Key หรือ PII data?
- [ ] (Standards) ทำตาม `project_manifest.md` ครบถ้วน?
- [ ] (Performance) ไม่มีการวนลูปซ้ำซ้อนหรือใช้ทรัพยากรเกินจำเป็น?

## 📝 2. Quality Checks
- [ ] (Clean Code) คอมเมนต์ Logic ที่ซับซ้อนเรียบร้อยแล้ว?
- [ ] (Tests) สร้าง UnitTest ครอบคลุมเคสสำคัญ (ตาม Scale)?
