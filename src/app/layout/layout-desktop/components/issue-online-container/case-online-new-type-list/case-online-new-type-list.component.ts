import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxFormComponent, DxMultiViewComponent, DxSelectBoxComponent } from "devextreme-angular";
import Swal from "sweetalert2";


import { User } from "src/app/services/user";
import DataSource from "devextreme/data/data_source";
import { IOrganizeInfo } from "share-ui/lib/models/organize-info.service";
import { Dialogue } from "src/app/services/dialogue";
import { CaseNewTypeService } from "src/app/services/case-new-type/casenewtype.service";
import { formatDate } from "devextreme/localization";

@Component({
    selector: "app-issue-online-informer",
    templateUrl: "./case-online-new-type-list.component.html",
    styleUrls: ["./case-online-new-type-list.component.scss"],
})
export class CaseOnlineNewTypeListComponent implements OnInit {
    @ViewChild(DxMultiViewComponent, { static: true }) multiView: DxMultiViewComponent;
    //    @ViewChild(ProblemOnlineAddComponent, { static: true }) form: ProblemOnlineAddComponent;
   
    //    public formProblem: IProblemInfo;
       _dataSource: DataSource;
       _isLoading = false;
       userId = {};
   
       // problem: IProblemInfo[] = [];
       constructor(
           private casenewtypeservice: CaseNewTypeService,
           private route: Router,
       ) {
       }
   
       ngOnInit(): void {
        //    this.form.mainForm = this;
           this.load();
       }
   
       load(){
           this._dataSource = new DataSource({
               load: () => this.casenewtypeservice.GetCaseNewTypeList().toPromise()
                   .then(_ => {
                       if (!_) {
                           _ = [];
                       }
                       return { data: _ };
                   })
           });
       }
       Add() {
           this.route.navigateByUrl("/main/issue-online/1");
  
       }
       Edit(e){
           this.multiView.selectedIndex = 1;
       }
   

     formatDate(e) {
           return formatDate(new Date(e.CREATE_DATE), "dateShortTimeThai");
       }
   
}
