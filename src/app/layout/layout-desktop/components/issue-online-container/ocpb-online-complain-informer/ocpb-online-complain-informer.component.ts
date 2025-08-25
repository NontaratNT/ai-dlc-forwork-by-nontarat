import { Component, Input, OnInit, Output } from '@angular/core';
import { IssueOnlineContainerComponent } from '../issue-online-container.component';
import { DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ProvinceService } from 'src/app/services/province.service';
import { DistrictService } from 'src/app/services/district.service';
import Swal from 'sweetalert2';
import { SubdistrictService } from 'src/app/services/subdistrict.service';

@Component({
  selector: 'app-ocpb-online-complain-informer',
  templateUrl: './ocpb-online-complain-informer.component.html',
  styleUrls: ['./ocpb-online-complain-informer.component.scss']
})
export class OcpbOnlineComplainInformerComponent implements OnInit {

  public mainConponent: IssueOnlineContainerComponent;
  isLoading = false;
  @Input() province: any = [];
  @Input() isView: boolean = false;
  @Input() ShowData: any = {};
  formData: any = {};
  _title = [
    { value: 'นาย', text: 'นาย' },
    { value: 'นาง', text: 'นาง' },
    { value: 'นางสาว', text: 'นางสาว' },
    { value: 'อื่นๆ', text: 'อื่นๆ' },
  ];
  _sex = [
    { value: 'm', text: 'ชาย' },
    { value: 'f', text: 'หญิง' },
  ];
  _ISOVERSEA = [
    { value: true, text: 'คนไทย' },
    { value: false, text: 'ต่างชาติ' },
  ];
  complainantAddress: any = {};
  Address: any = {};
  maxDateValue: Date = new Date();

  constructor(
    private serviceProvince: ProvinceService,
    private serviceDistrict: DistrictService,
    private serviceSubDistrict: SubdistrictService,
  ) { }

  ngOnInit(): void {
    console.log(this.mainConponent);
    if (this.isView) {
      this.formData = this.ShowData;
      this.loadDataAddress();
    }
  }

  loadDataAddress() {
    if (this.formData.CARDPROVINCE_CODE) {
      this.serviceProvince
        .GetDistrictofProvince(this.formData.CARDPROVINCE_CODE)
        .subscribe((_) => {
          this.complainantAddress.district = _;
          this.complainantAddress.disableDistrict = false;
        });
    }
    if (this.formData.CARDAMPHER_CODE) {
      this.serviceDistrict
        .GetSubDistrictOfDistrict(this.formData.CARDAMPHER_CODE)
        .subscribe((_) => {
          this.complainantAddress.subDistrict = _;
          this.complainantAddress.disableSubDistrict = false;
        });
    }
    if (this.formData.CARDTUMBON_CODE) {
      this.serviceSubDistrict
        .GetPostCode(this.formData.CARDTUMBON_CODE)
        .subscribe((_) => {
          this.complainantAddress.postcode = _;
          this.complainantAddress.disablepostcode = false;
        });
    }

    if (this.formData.PROVINCE_CODE) {
      this.serviceProvince
        .GetDistrictofProvince(this.formData.PROVINCE_CODE)
        .subscribe((_) => {
          this.Address.district = _;
          this.Address.disableDistrict = false;
        });
    }
    if (this.formData.AMPHER_CODE) {
      this.serviceDistrict
        .GetSubDistrictOfDistrict(this.formData.AMPHER_CODE)
        .subscribe((_) => {
          this.Address.subDistrict = _;
          this.Address.disableSubDistrict = false;
        });
    }
    if (this.formData.TUMBON_CODE) {
      this.serviceSubDistrict
        .GetPostCode(this.formData.TUMBON_CODE)
        .subscribe((_) => {
          this.Address.postcode = _;
          this.Address.disablepostcode = false;
        });
    }
  }

  SetDataDefulse() {
    this.province = this.mainConponent.province;
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
    localStorage.setItem('ocpb-informer', JSON.stringify(this.formData));
    if (e != 'tab') {
      this.mainConponent.NextIndex(this.mainConponent.indexTab + 1);
    }
  }

  citizenPattern(params) {
    const makeScope = new RegExp(
      '^[0-9]{1}[0-9]{4}[0-9]{5}[0-9]{2}[0-9]{1}$'
    );
    return makeScope.test(params.value);
  }

  CheckNumber(event) {
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^([0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(event.key);
    return result;
  }

  PasteCheckNumber(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^([0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(pastedText);
    return result;
  }

  passeportPattern(params) {
    const makeScope = new RegExp('^[A-Z]{1,2}[0-9]{6,}$');
    return makeScope.test(params.value);
  }

  CheckPassportNumber(event) {
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^([A-Z0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(event.key);
    return result;
  }

  PasteCheckPassportNumber(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    // const seperator  = '^[ก-๏\\s]+$';
    const seperator = '^([0-9])';
    const maskSeperator = new RegExp(seperator, 'g');
    const result = maskSeperator.test(pastedText);
    return result;
  }

  telPattern(params) {
    const makeScope = new RegExp('^[0-9]{3}[0-9]{3}[0-9]{4}$');
    return makeScope.test(params.value);
  }

  OnSelectProviceCard(e, tag: DxSelectBoxComponent) {
    this.complainantAddress.district = [];
    this.complainantAddress.subDistrict = [];
    this.complainantAddress.postcode = [];
    this.complainantAddress.disableDistrict = true;
    this.complainantAddress.disablepostcode = true;
    this.complainantAddress.disableSubDistrict = true;
    // this.formData.CARDAMPHER = undefined;
    // this.formData.CARDAMPHER_CODE = undefined;
    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.CARDPROVINCE_CODE = data.PROVINCE_ID;
        this.formData.CARDPROVINCE = data.PROVINCE_NAME_THA;
      } else {
        this.formData.CARDPROVINCE_CODE = e.value;
      }

      this.serviceProvince
        .GetDistrictofProvince(e.value)
        .subscribe((_) => {
          this.complainantAddress.district = _;
          this.complainantAddress.disableDistrict = false;
        });
    }
  }

  OnSelectDistrictCard(e, tag: DxSelectBoxComponent) {
    this.complainantAddress.subDistrict = [];
    this.complainantAddress.postcode = [];
    this.complainantAddress.disableSubDistrict = true;
    this.complainantAddress.disablepostcode = true;
    // this.formData.CARDTUMBON_CODE = undefined;
    // this.formData.CARDTUMBON = undefined;
    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.CARDAMPHER_CODE = data.DISTRICT_ID;
        this.formData.CARDAMPHER = data.DISTRICT_NAME_THA;
      } else {
        this.formData.CARDAMPHER_CODE = e.value;
      }

      this.serviceDistrict
        .GetSubDistrictOfDistrict(e.value)
        .subscribe((_) => {
          this.complainantAddress.subDistrict = _;
          this.complainantAddress.disableSubDistrict = false;
        });
    }
  }

  OnSelectSubDistrictCard(e, tag: DxSelectBoxComponent) {
    this.complainantAddress.postcode = [];
    this.complainantAddress.disablepostcode = true;

    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.CARDTUMBON_CODE = data.SUB_DISTRICT_ID;
        this.formData.CARDTUMBON = data.SUB_DISTRICT_NAME_THA;
      } else {
        this.formData.CARDTUMBON_CODE = e.value;
      }

      this.serviceSubDistrict.GetPostCode(e.value).subscribe((_) => {
        this.complainantAddress.postcode = _;
        this.complainantAddress.disablepostcode = false;
        this.formData.CARDZIPCODE = _[0].POSTCODE_CODE;
      });
    }
  }

  OnSelectProvice(e, tag: DxSelectBoxComponent) {
    this.Address.district = [];
    this.Address.subDistrict = [];
    this.Address.postcode = [];
    this.Address.disableDistrict = true;
    this.Address.disablepostcode = true;
    this.Address.disableSubDistrict = true;
    // this.formData.CARDAMPHER = undefined;
    // this.formData.CARDAMPHER_CODE = undefined;
    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.PROVINCE_CODE = data.PROVINCE_ID;
        this.formData.PROVINCE = data.PROVINCE_NAME_THA;
      } else {
        this.formData.PROVINCE_CODE = e.value;
      }

      this.serviceProvince
        .GetDistrictofProvince(e.value)
        .subscribe((_) => {
          this.Address.district = _;
          this.Address.disableDistrict = false;
        });
    }
  }

  OnSelectDistrict(e, tag: DxSelectBoxComponent) {
    this.Address.subDistrict = [];
    this.Address.postcode = [];
    this.Address.disableSubDistrict = true;
    this.Address.disablepostcode = true;
    // this.formData.CARDTUMBON_CODE = undefined;
    // this.formData.CARDTUMBON = undefined;
    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.AMPHER_CODE = data.DISTRICT_ID;
        this.formData.AMPHER = data.DISTRICT_NAME_THA;
      } else {
        this.formData.AMPHER_CODE = e.value;
      }

      this.serviceDistrict
        .GetSubDistrictOfDistrict(e.value)
        .subscribe((_) => {
          this.Address.subDistrict = _;
          this.Address.disableSubDistrict = false;
        });
    }
  }

  OnSelectSubDistrict(e, tag: DxSelectBoxComponent) {
    this.Address.postcode = [];
    this.Address.disablepostcode = true;

    if (e.value) {
      const data =
        tag.instance.option('selectedItem');
      if (data) {
        this.formData.TUMBON_CODE = data.SUB_DISTRICT_ID;
        this.formData.TUMBON = data.SUB_DISTRICT_NAME_THA;
      } else {
        this.formData.TUMBON_CODE = e.value;
      }

      this.serviceSubDistrict.GetPostCode(e.value).subscribe((_) => {
        this.Address.postcode = _;
        this.Address.disablepostcode = false;
        this.formData.ZIPCODE = _[0].POSTCODE_CODE;
      });
    }
  }

}
