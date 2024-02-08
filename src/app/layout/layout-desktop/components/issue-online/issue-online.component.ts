import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import Swal from "sweetalert2";

@Component({
    selector: "app-issue-online",
    templateUrl: "./issue-online.component.html",
    styleUrls: ["./issue-online.component.scss"],
})
export class IssueOnlineComponent implements OnInit {
    userType = "mySelf";
    reloadTab = false;
    isCheckReport : boolean = false;
    constructor(
        private _activeRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // const data = history.state || undefined;
        // this.userType = data.userType || "mySelf";
        // console.log('this.userType ->>>>',data);
        // this._activeRoute.data.subscribe(_ => {
        //     // console.log('this.userType ->>>>',_);
        // });
        this.isCheckReport = true
        if(this.isCheckReport){
            Swal.fire({
                icon : "warning",
                title : "เกิดข้อผิดพลาด!",
                html : "ท่านถูกจำกัดแจ้งความเข้าระบบได้วันละ 2 เคสเท่านั้น<br>เพื่อความรวดเร็วในการตรวจสอบเคสที่ท่านแจ้งมาก่อนหน้า<br>ขออภัยในความไม่สะดวก หากมีความจำเป็นต้องแจ้งความรบกวนโทรไปที่ 1441",
                confirmButtonText : "ตกลง"
            }).then((result)=>{
                if(result.isConfirmed){
                    return
                }
            })
            return
        }
        this._activeRoute.params.subscribe(params => {
            this.userType = params.userType === '2'?"other":"mySelf";
            this.reloadTab = true;
        });
    }
}
