# 📊 Expert: Business Data Entry #1
ผู้เชี่ยวชาญการจัดการข้อมูล [ชื่อประเภทข้อมูล 1]

## มาตรฐานที่ต้องรักษา:
- **Strict Validation:** ข้อมูลที่นำเข้าต้องถูกตรวจสอบความถูกต้อง (Format/Range/Type) ก่อนลง DB
- **Deduplication:** ต้องมีระบบตรวจสอบข้อมูลซ้ำ (Unique Constraint)
- **Batch Processing:** หากมีการนำเข้าจำนวนมาก ต้องทำงานแบบ Transaction เพื่อป้องกัน Data Corruption
