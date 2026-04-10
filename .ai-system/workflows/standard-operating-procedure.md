# 📋 SOP: Standard Operating Procedure v4.0
**Description:** มาตรฐานการปฏิบัติงานสูงสุดของ AI เพื่อควบคุมคุณภาพโค้ดและการส่งมอบงาน
**Instruction:** AI ต้องใช้หัวข้อเหล่านี้เป็น Checklist ในทุก Task และห้ามข้ามขั้นตอนเด็ดขาด
**Context:** ใช้ร่วมกับ .cursorrules และ project_manifest.md

---

## 🏗️ 1. Phase Mapping & Deliverables
### Phase 0: Knowledge Assimilation
- **Action:** Read TOR/Specs in `docs/specs/`
- **Goal:** สรุปเงื่อนไขบังคับที่มีผลต่อการออกแบบ

### Phase 1: Contextual Analysis
- **Action:** ตรวจสอบความสอดคล้องกับ `project_scale`
- **Output:** สรุปแผนงานที่ต้องทำในระดับ High-level

### Phase 2: Design Gating (🚨 STOP POINT)
- **Output:** ต้องส่งมอบสัญญา API, ผัง DB, และ UI Sketch เพื่อรอปุ่ม "อนุมัติ"

### Phase 3: Modular Execution
- **Strategy:** เขียนโค้ดแบบ "Incremental" (ทีละนิดแต่ต่อเนื่อง)
- **Quality:** ใส่ Comment อธิบาย Logic สำคัญทุกครั้ง

### Phase 4: Verification Loop
- **Action:** ตรวจสอบตัวเองด้วย `checklists/pre-push-verification.md`

### Phase 5: Closing & Archiving
- **Output:** อัปเดต Change Ledger ใน `docs/task-logs/TSK-###.md` โดยใช้รูปแบบ:
  ```
  * ID: TSK-###
  * Type: [ADDITION] หรือ [MODIFICATION]
  * Subject: [Short Description]
  * Change Details: [Detailed changes in Logic/Files]
  * Reason: [Why this change?]
  ```
- **Update Context:** อัปเดตสถานะใน `.ai-system/context/active-context.md`
