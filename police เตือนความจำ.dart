@dropdown #การโอนเงินผ่านธนาคาร (ไปยังบัญชีของคนร้าย)
	[key] @dropdown ประเภทการโอน  
	[value] @dropdown ธนาคาร / พร้อมเพย์
        @if ธนาคาร ต้องกรอกดังนี้
            {
                [key]   @text ธนาคาร  
                [value] @dropdown BankInfoList
            },
            {
                [key]   @text ชื่อบัญชี   
                [value] @text 
            },
            {
                [key]   @text เลขบัญชี 
                [value] @text 
            },
            {
                [key]   @text วันที่โอน 
                [value] @date 
            },
            {
                [key]   @text เวลาที่โอน 
                [value] @time 
            },
            {
                [key]   @text จำนวนเงิน 
                [value] @number 
            },
            {
                [key]   @text ไฟล์แนบ 
                [value] @file 
            },

        @else พร้อมเพย์ ต้องกรอกดังนี้
            {
                [key]   @text ชื่อบัญชี   
                [value] @text 
            },
            {
                [key]   @text พร้อมเพย์  
                [value] @dropdown
            },
            {
                [key]   @text วันที่โอน 
                [value] @date 
            },
            {
                [key]   @text เวลาที่โอน 
                [value] @time 
            },
            {
                [key]   @text จำนวนเงิน 
                [value] @number 
            },
            {
                [key]   @text ไฟล์แนบ 
                [value] @file 
            },


___________________________________________________________

@dropdown #การโอนเงินด้วยวิธีอื่น (ไปยังบัญชีของคนร้าย)
___________________________________________________________

@dropdown #รายการทรัพย์สินที่เสียหาย
___________________________________________________________
 


/* 	
	เตือนความจำเป็น 
	- ต้องทำหน้า investigative-record-entity
	- ต้องทำหน้า investigative-record-entity-new

	ห้ามลืมก่อน deploy
	1 task-admin-view.components.ts เปลี่ยนค่าเป็น 0
		public indexTab = 3 -> 0
*/