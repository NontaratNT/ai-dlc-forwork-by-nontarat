import { Component, Input, OnInit } from '@angular/core';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ProvinceService } from 'src/app/services/province.service';
import { DistrictService } from 'src/app/services/district.service';
import Swal from 'sweetalert2';
import { SubdistrictService } from 'src/app/services/subdistrict.service';

@Component({
  selector: 'app-ocpb-online-complain-detail',
  templateUrl: './ocpb-online-complain-detail.component.html',
  styleUrls: ['./ocpb-online-complain-detail.component.scss']
})
export class OcpbOnlineComplainDetailComponent implements OnInit {

  // @Input() mainConponent: IssueOnlineContainerComponent;
  public mainConponent: IssueOnlineContainerComponent;
  @Input() province: any = [];
  @Input() isView: boolean = false;
  @Input() ShowData: any = {};
  isLoading = false;
  formData: any = {};


  complainantAddress: any = {};
  companyAddress: any = {};
  Address: any = {};

  listCaseType: any = [
    { CASE_TYPE_ID: 60, CASE_TYPE_NAME: 'หลอกลวงซื้อขายสินค้าหรือบริการ ที่ไม่มีลักษณะเป็นขบวนการ' },
    { CASE_TYPE_ID: 72, CASE_TYPE_NAME: 'หลอกลวงซื้อขายสินค้าหรือบริการ ที่มีลักษณะเป็นขบวนการ' },
  ];


  constructor(
    private serviceProvince: ProvinceService,
    private serviceDistrict: DistrictService,
    private serviceSubDistrict: SubdistrictService
  ) { }

  ngOnInit(): void {
     if (this.isView) {
      this.formData = this.ShowData;
      this.loadDataAddress();
    }
  }

  Back(e) {
    this.mainConponent.NextIndex(this.mainConponent.indexTab - 1);
  }

  SubmitForm(e, form: DxFormComponent) {
    if (!form.instance.validate().isValid) {
      Swal.fire({
        title: 'กรอกข้อมูลไม่ครบ!',
        text: `${form.instance.validate().brokenRules.map(rule => rule.message).join(', ')}`,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      }).then(() => { });
      return;
    }
    localStorage.setItem( 'ocpb-detail', JSON.stringify(this.formData));
    if (e != 'tab') {
      this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
  }

  loadDataAddress(){
    if (this.formData.COMPANYPROVINCE_CODE) {
      this.serviceProvince.GetDistrictofProvince(this.formData.COMPANYPROVINCE_CODE).subscribe((_) => {
        this.complainantAddress.district = _;
        this.complainantAddress.disableDistrict = false;
      });
    }
    if (this.formData.COMPANYAMPHUR_CODE) {
      this.serviceDistrict.GetSubDistrictOfDistrict(this.formData.COMPANYAMPHUR_CODE).subscribe((_) => {
        this.companyAddress.subDistrict = _;
        this.companyAddress.disableSubDistrict = false;
      });
    }
  }

  OnSelectProviceCompany(e, tag: DxSelectBoxComponent) {
    this.companyAddress.district = [];
    this.companyAddress.subDistrict = [];
    this.companyAddress.postcode = [];
    this.companyAddress.disableDistrict = true;
    this.companyAddress.disablepostcode = true;
    this.companyAddress.disableSubDistrict = true;
    // this.formDataant.COMPANYAMPHUR = undefined;
    // this.formDataant.COMPANYAMPHUR_CODE = undefined;
    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.COMPANYPROVINCE_CODE = data.PROVINCE_ID;
        this.formData.COMPANYPROVINCE = data.PROVINCE_NAME_THA;
      } else {
        this.formData.COMPANYPROVINCE_CODE = e.value;
      }

      this.serviceProvince
        .GetDistrictofProvince(e.value)
        .subscribe((_) => {
          this.companyAddress.district = _;
          this.companyAddress.disableDistrict = false;
        });
    }
  }

  OnSelectDistrictCompany(e, tag: DxSelectBoxComponent) {
    this.companyAddress.subDistrict = [];
    this.companyAddress.postcode = [];
    this.companyAddress.disableSubDistrict = true;
    this.companyAddress.disablepostcode = true;
    // this.formDataant.COMPANYTUMBON_CODE = undefined;
    // this.formDataant.COMPANYTUMBON = undefined;
    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.COMPANYAMPHUR_CODE = data.DISTRICT_ID;
        this.formData.COMPANYAMPHUR = data.DISTRICT_NAME_THA;
      } else {
        this.formData.COMPANYAMPHUR_CODE = e.value;
      }

      this.serviceDistrict
        .GetSubDistrictOfDistrict(e.value)
        .subscribe((_) => {
          this.companyAddress.subDistrict = _;
          this.companyAddress.disableSubDistrict = false;
        });
    }
  }

  OnSelectSubDistrictCompany(e, tag: DxSelectBoxComponent) {
    this.companyAddress.postcode = [];
    this.companyAddress.disablepostcode = true;

    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.COMPANYTUMBON_CODE = data.SUB_DISTRICT_ID;
        this.formData.COMPANYTUMBON = data.SUB_DISTRICT_NAME_THA;
      } else {
        this.formData.COMPANYTUMBON_CODE = e.value;
      }

      this.serviceSubDistrict.GetPostCode(e.value).subscribe((_) => {
        this.companyAddress.postcode = _;
        this.companyAddress.disablepostcode = false;
        this.formData.COMPANYZIPCODE = _[0].POSTCODE_CODE;
      });
    }
  }

}
