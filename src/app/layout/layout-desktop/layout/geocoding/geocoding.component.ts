import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DistrictService } from 'src/app/services/district.service';
import { GoogleMapsService } from 'src/app/services/google-map/google-maps.service';
import { OrgService } from 'src/app/services/org.service';
import { ProvinceService } from 'src/app/services/province.service';
import { SubdistrictService } from 'src/app/services/subdistrict.service';

@Component({
  selector: 'app-geocoding',
  templateUrl: './geocoding.component.html',
  styleUrls: ['./geocoding.component.scss']
})
export class GeocodingComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() formData: any;
  @Input() formType: string;
  @Output() onStationSelected = new EventEmitter<any>();
  
  address: string = '';
  lat: number = 13.7563;
  lng: number = 100.5018;
  results: google.maps.GeocoderResult[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Extracted Address Components
  subDistrict: string = '';
  district: string = '';
  province: string = '';
  postcode: string = '';
  policeStation: string = '';
  fullAddressDetails: any = null;

  // Master Data
  provincesList: any[] = [];
  districtsList: any = { incident: [], transfer: [], bankBranch: [] };
  subDistrictsList: any = { incident: [], transfer: [], bankBranch: [] };
  postcodesList: any = { incident: [], transfer: [], bankBranch: [] };
  policeStationsList: any[] = [];
  policeStationGeoJson: any = null;

  // New Location Fields
  incident: any = {
    CASE_LOCATION_ADDRESS: '',
    CASE_LOCATION_PROVINCE_ID: null,
    CASE_LOCATION_DISTRICT_ID: null,
    CASE_LOCATION_SUB_DISTRICT_ID: null,
    CASE_LOCATION_POSTCODE: '',
    CASE_LOCATION_POLICE_STATION_ID: null,
    CASE_LOCATION_PROVINCE_NAME_THA: '',
    CASE_LOCATION_DISTRICT_NAME_THA: '',
    CASE_LOCATION_SUB_DISTRICT_NAME_THA: '',
    CASE_LOCATION_POLICE_STATION_NAME_THA: ''
  };

  transfer: any = {
    CASE_LOCATION_TRANSFER_CASE_INFORMER_ADDRESS: '',
    CASE_LOCATION_TRANSFER_PROVINCE_ID: null,
    CASE_LOCATION_TRANSFER_DISTRICT_ID: null,
    CASE_LOCATION_TRANSFER_SUB_DISTRICT_ID: null,
    CASE_LOCATION_TRANSFER_POSTCODE: '',
    CASE_LOCATION_TRANSFER_POLICE_STATION_ID: null,
    CASE_LOCATION_TRANSFER_PROVINCE_NAME_THA: '',
    CASE_LOCATION_TRANSFER_DISTRICT_NAME_THA: '',
    CASE_LOCATION_TRANSFER_SUB_DISTRICT_NAME_THA: '',
    CASE_LOCATION_TRANSFER_POLICE_STATION_NAME_THA: ''
  };

  bankBranch: any = {
    CASE_LOCATION_BANK_BRANCH_ADDRESS: '',
    CASE_LOCATION_BANK_BRANCH_PROVINCE_ID: null,
    CASE_LOCATION_BANK_BRANCH_DISTRICT_ID: null,
    CASE_LOCATION_BANK_BRANCH_SUB_DISTRICT_ID: null,
    CASE_LOCATION_BANK_BRANCH_POSTCODE: '',
    CASE_LOCATION_BANK_BRANCH_POLICE_STATION_ID: null,
    CASE_LOCATION_BANK_BRANCH_PROVINCE_NAME_THA: '',
    CASE_LOCATION_BANK_BRANCH_DISTRICT_NAME_THA: '',
    CASE_LOCATION_BANK_BRANCH_SUB_DISTRICT_NAME_THA: '',
    CASE_LOCATION_BANK_BRANCH_POLICE_STATION_NAME_THA: ''
  };

  stations: any = {
    incident: null,
    transfer: null,
    bankBranch: null
  };

  locationMappings: any = {
    incident: {
      address: 'CASE_LOCATION_ADDRESS',
      provinceId: 'CASE_LOCATION_PROVINCE_ID',
      provinceName: 'CASE_LOCATION_PROVINCE_NAME_THA',
      districtId: 'CASE_LOCATION_DISTRICT_ID',
      districtName: 'CASE_LOCATION_DISTRICT_NAME_THA',
      subDistrictId: 'CASE_LOCATION_SUB_DISTRICT_ID',
      subDistrictName: 'CASE_LOCATION_SUB_DISTRICT_NAME_THA',
      postcode: 'CASE_LOCATION_POSTCODE',
      stationId: 'CASE_LOCATION_POLICE_STATION_ID',
      stationName: 'CASE_LOCATION_POLICE_STATION_NAME_THA'
    },
    transfer: {
      address: 'CASE_LOCATION_TRANSFER_CASE_INFORMER_ADDRESS',
      provinceId: 'CASE_LOCATION_TRANSFER_PROVINCE_ID',
      provinceName: 'CASE_LOCATION_TRANSFER_PROVINCE_NAME_THA',
      districtId: 'CASE_LOCATION_TRANSFER_DISTRICT_ID',
      districtName: 'CASE_LOCATION_TRANSFER_DISTRICT_NAME_THA',
      subDistrictId: 'CASE_LOCATION_TRANSFER_SUB_DISTRICT_ID',
      subDistrictName: 'CASE_LOCATION_TRANSFER_SUB_DISTRICT_NAME_THA',
      postcode: 'CASE_LOCATION_TRANSFER_POSTCODE',
      stationId: 'CASE_LOCATION_TRANSFER_POLICE_STATION_ID',
      stationName: 'CASE_LOCATION_TRANSFER_POLICE_STATION_NAME_THA'
    },
    bankBranch: {
      address: 'CASE_LOCATION_BANK_BRANCH_ADDRESS',
      provinceId: 'CASE_LOCATION_BANK_BRANCH_PROVINCE_ID',
      provinceName: 'CASE_LOCATION_BANK_BRANCH_PROVINCE_NAME_THA',
      districtId: 'CASE_LOCATION_BANK_BRANCH_DISTRICT_ID',
      districtName: 'CASE_LOCATION_BANK_BRANCH_DISTRICT_NAME_THA',
      subDistrictId: 'CASE_LOCATION_BANK_BRANCH_SUB_DISTRICT_ID',
      subDistrictName: 'CASE_LOCATION_BANK_BRANCH_SUB_DISTRICT_NAME_THA',
      postcode: 'CASE_LOCATION_BANK_BRANCH_POSTCODE',
      stationId: 'CASE_LOCATION_BANK_BRANCH_POLICE_STATION_ID',
      stationName: 'CASE_LOCATION_BANK_BRANCH_POLICE_STATION_NAME_THA'
    }
  };
  
  provinceResponsibility = [
    { province: "กรุงเทพมหานคร", org_name: "บก.สอท.1", org_id: 3536, province_id: 10 },
    { province: "นนทบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 12 },
    { province: "ปทุมธานี", org_name: "บก.สอท.2", org_id: 3548, province_id: 13 },
    { province: "สมุทรปราการ", org_name: "บก.สอท.2", org_id: 3548, province_id: 11 },
    { province: "พระนครศรีอยุธยา", org_name: "บก.สอท.2", org_id: 3548, province_id: 14 },
    { province: "อ่างทอง", org_name: "บก.สอท.2", org_id: 3548, province_id: 15 },
    { province: "สิงห์บุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 17 },
    { province: "ลพบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 16 },
    { province: "ชัยนาท", org_name: "บก.สอท.2", org_id: 3548, province_id: 18 },
    { province: "สระบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 19 },
    { province: "ชลบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 20 },
    { province: "ระยอง", org_name: "บก.สอท.2", org_id: 3548, province_id: 21 },
    { province: "จันทบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 22 },
    { province: "ตราด", org_name: "บก.สอท.2", org_id: 3548, province_id: 23 },
    { province: "ฉะเชิงเทรา", org_name: "บก.สอท.2", org_id: 3548, province_id: 24 },
    { province: "ปราจีนบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 25 },
    { province: "สระแก้ว", org_name: "บก.สอท.2", org_id: 3548, province_id: 27 },
    { province: "นครนายก", org_name: "บก.สอท.2", org_id: 3548, province_id: 26 },
    { province: "นครปฐม", org_name: "บก.สอท.2", org_id: 3548, province_id: 73 },
    { province: "ราชบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 70 },
    { province: "สุพรรณบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 72 },
    { province: "กาญจนบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 71 },
    { province: "สมุทรสาคร", org_name: "บก.สอท.2", org_id: 3548, province_id: 74 },
    { province: "สมุทรสงคราม", org_name: "บก.สอท.2", org_id: 3548, province_id: 75 },
    { province: "เพชรบุรี", org_name: "บก.สอท.2", org_id: 3548, province_id: 76 },
    { province: "ประจวบคีรีขันธ์", org_name: "บก.สอท.2", org_id: 3548, province_id: 77 },
    { province: "นครราชสีมา", org_name: "บก.สอท.3", org_id: 3559, province_id: 30 },
    { province: "บุรีรัมย์", org_name: "บก.สอท.3", org_id: 3559, province_id: 31 },
    { province: "สุรินทร์", org_name: "บก.สอท.3", org_id: 3559, province_id: 32 },
    { province: "ศรีสะเกษ", org_name: "บก.สอท.3", org_id: 3559, province_id: 33 },
    { province: "ชัยภูมิ", org_name: "บก.สอท.3", org_id: 3559, province_id: 36 },
    { province: "ขอนแก่น", org_name: "บก.สอท.3", org_id: 3559, province_id: 40 },
    { province: "มหาสารคาม", org_name: "บก.สอท.3", org_id: 3559, province_id: 44 },
    { province: "กาฬสินธุ์", org_name: "บก.สอท.3", org_id: 3559, province_id: 46 },
    { province: "ร้อยเอ็ด", org_name: "บก.สอท.3", org_id: 3559, province_id: 45 },
    { province: "อุดรธานี", org_name: "บก.สอท.3", org_id: 3559, province_id: 41 },
    { province: "หนองบัวลำภู", org_name: "บก.สอท.3", org_id: 3559, province_id: 39 },
    { province: "หนองคาย", org_name: "บก.สอท.3", org_id: 3559, province_id: 43 },
    { province: "เลย", org_name: "บก.สอท.3", org_id: 3559, province_id: 42 },
    { province: "สกลนคร", org_name: "บก.สอท.3", org_id: 3559, province_id: 47 },
    { province: "นครพนม", org_name: "บก.สอท.3", org_id: 3559, province_id: 48 },
    { province: "บึงกาฬ", org_name: "บก.สอท.3", org_id: 3559, province_id: 38 },
    { province: "มุกดาหาร", org_name: "บก.สอท.3", org_id: 3559, province_id: 49 },
    { province: "อุบลราชธานี", org_name: "บก.สอท.3", org_id: 3559, province_id: 34 },
    { province: "ยโสธร", org_name: "บก.สอท.3", org_id: 3559, province_id: 35 },
    { province: "อำนาจเจริญ", org_name: "บก.สอท.3", org_id: 3559, province_id: 37 },
    { province: "เชียงใหม่", org_name: "บก.สอท.4", org_id: 3567, province_id: 50 },
    { province: "เชียงราย", org_name: "บก.สอท.4", org_id: 3567, province_id: 57 },
    { province: "ลำพูน", org_name: "บก.สอท.4", org_id: 3567, province_id: 51 },
    { province: "ลำปาง", org_name: "บก.สอท.4", org_id: 3567, province_id: 52 },
    { province: "แม่ฮ่องสอน", org_name: "บก.สอท.4", org_id: 3567, province_id: 58 },
    { province: "พะเยา", org_name: "บก.สอท.4", org_id: 3567, province_id: 56 },
    { province: "แพร่", org_name: "บก.สอท.4", org_id: 3567, province_id: 54 },
    { province: "น่าน", org_name: "บก.สอท.4", org_id: 3567, province_id: 55 },
    { province: "พิษณุโลก", org_name: "บก.สอท.4", org_id: 3567, province_id: 65 },
    { province: "เพชรบูรณ์", org_name: "บก.สอท.4", org_id: 3567, province_id: 67 },
    { province: "พิจิตร", org_name: "บก.สอท.4", org_id: 3567, province_id: 66 },
    { province: "อุตรดิตถ์", org_name: "บก.สอท.4", org_id: 3567, province_id: 53 },
    { province: "กำแพงเพชร", org_name: "บก.สอท.4", org_id: 3567, province_id: 62 },
    { province: "สุโขทัย", org_name: "บก.สอท.4", org_id: 3567, province_id: 64 },
    { province: "ตาก", org_name: "บก.สอท.4", org_id: 3567, province_id: 63 },
    { province: "นครสวรรค์", org_name: "บก.สอท.4", org_id: 3567, province_id: 60 },
    { province: "อุทัยธานี", org_name: "บก.สอท.4", org_id: 3567, province_id: 61 },
    { province: "ชุมพร", org_name: "บก.สอท.5", org_id: 3578, province_id: 86 },
    { province: "สุราษฎร์ธานี", org_name: "บก.สอท.5", org_id: 3578, province_id: 84 },
    { province: "นครศรีธรรมราช", org_name: "บก.สอท.5", org_id: 3578, province_id: 80 },
    { province: "พังงา", org_name: "บก.สอท.5", org_id: 3578, province_id: 82 },
    { province: "ภูเก็ต", org_name: "บก.สอท.5", org_id: 3578, province_id: 83 },
    { province: "ระนอง", org_name: "บก.สอท.5", org_id: 3578, province_id: 85 },
    { province: "กระบี่", org_name: "บก.สอท.5", org_id: 3578, province_id: 81 },
    { province: "ตรัง", org_name: "บก.สอท.5", org_id: 3578, province_id: 92 },
    { province: "พัทลุง", org_name: "บก.สอท.5", org_id: 3578, province_id: 93 },
    { province: "สงขลา", org_name: "บก.สอท.5", org_id: 3578, province_id: 90 },
    { province: "สตูล", org_name: "บก.สอท.5", org_id: 3578, province_id: 91 },
    { province: "ปัตตานี", org_name: "บก.สอท.5", org_id: 3578, province_id: 94 },
    { province: "ยะลา", org_name: "บก.สอท.5", org_id: 3578, province_id: 95 },
    { province: "นราธิวาส", org_name: "บก.สอท.5", org_id: 3578, province_id: 96 }
  ];

  constructor(
    private googleMapsService: GoogleMapsService,
    private orgService: OrgService,
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private subDistrictService: SubdistrictService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('assets/map/ขอบเขต สน..geojson').subscribe((res: any) => {
      this.policeStationGeoJson = res;
    });

    this.loadProvinces();
    this.loadPoliceStations();
    this.initFromFormData();
  }

  initFromFormData() {
    if (!this.formData) return;

    const types = ['incident', 'transfer', 'bankBranch'];
    types.forEach(type => {
      const target = (this as any)[type];
      const mapping = this.locationMappings[type];

      Object.keys(mapping).forEach(key => {
        const formKey = mapping[key];
        if (this.formData[formKey]) {
          target[formKey] = this.formData[formKey];
        }
      });
    });
  }

  loadProvinces() {
    console.log('Loading provinces...');
    this.provinceService.GetProvince().subscribe(
      res => {
        console.log('Provinces response:', res);
        this.provincesList = res || res || res;
        console.log('Provinces list assigned:', this.provincesList);
      },
      err => {
        console.error('Error loading provinces:', err);
      }
    );
  }

  loadPoliceStations() {
    this.orgService.getorgwalkinall().subscribe(res => {
      this.policeStationsList = res;
    });
  }

  onProvinceChange(type: string, event: any) {
    const provinceId = event.value;
    if (!provinceId) return;
    
    const target = (this as any)[type];
    const mapping = this.locationMappings[type];

    if (event.event !== undefined) {
      // Clear dependent fields ONLY if triggered by user
      target[mapping.provinceId] = provinceId;
      target[mapping.districtId] = null;
      target[mapping.subDistrictId] = null;
      target[mapping.postcode] = '';
      this.subDistrictsList[type] = [];
      this.postcodesList[type] = [];
  
      // Map Province Name
      const prov = this.provincesList.find((p: any) => p.PROVINCE_ID === provinceId);
      if (prov) {
        target[mapping.provinceName] = prov.PROVINCE_NAME_THA;
      }
    }

    this.provinceService.GetDistrictofProvince(provinceId).subscribe(res => {
      this.districtsList[type] = res;
      this.syncToFormData(type);
    });
  }

  onDistrictChange(type: string, event: any) {
    const districtId = event.value;
    if (!districtId) return;

    const target = (this as any)[type];
    const mapping = this.locationMappings[type];

    if (event.event !== undefined) {
      target[mapping.districtId] = districtId;
      target[mapping.subDistrictId] = null;
      target[mapping.postcode] = '';
      this.subDistrictsList[type] = [];
      this.postcodesList[type] = [];
  
      // Map District Name
      const dist = this.districtsList[type].find((d: any) => d.DISTRICT_ID === districtId);
      if (dist) {
        target[mapping.districtName] = dist.DISTRICT_NAME_THA;
      }
    }

    this.districtService.GetSubDistrictOfDistrict(districtId).subscribe(res => {
      this.subDistrictsList[type] = res;
      this.syncToFormData(type);
    });

    if (event.event === undefined) return; // Skip recalculating station if programmatic

    // --- New Form Smart Calculation ---
    // Check damage to determine if it should be CCIB or Local Station
    const formDamage = JSON.parse(localStorage.getItem('form-damage') || '{}');
    const totalDamage = Number(formDamage?.TotalDamageValue?.toString().replace(/,/g, '') || 0);
    const provinceId = target[mapping.provinceId];

    let station = null;

    if (totalDamage >= 1000000) {
      // Rule: Damage > 1M -> Must go to CCIB for this province
      console.log('Damage > 1M: Mapping to CCIB unit');
      const ccibMatch = this.provinceResponsibility.find(r => r.province_id == provinceId);
      if (ccibMatch) {
         station = this.policeStationsList.find(s => s.ORGANIZE_ID === ccibMatch.org_id);
      }
    } else {
      // Rule: Damage <= 1M -> Map to local police station by district
      console.log('Damage <= 1M: Mapping to local police station');
      station = this.policeStationsList.find((s: any) => 
        (s.ORGANIZE_ADDRESS_DISRICT == districtId || s.ORGANIZE_ADDRESS_DISTRICT == districtId) &&
        (s.ORGANIZE_NAME_THA?.includes('สภ.') || s.ORGANIZE_NAME_THA?.includes('สน.') || s.ORGANIZE_NAME_THA?.includes('สถานีตำรวจ'))
      );
      
      // Fallback 1: match by ID without strict name prefix
      if (!station) {
        station = this.policeStationsList.find((s: any) => 
          s.ORGANIZE_ADDRESS_DISRICT == districtId || s.ORGANIZE_ADDRESS_DISTRICT == districtId
        );
      }

      // Fallback 2: String matching for Bangkok and others (e.g., district "บางรัก" -> "สน.บางรัก")
      if (!station && target[mapping.districtName]) {
        const cleanDistName = target[mapping.districtName].replace('เขต', '').replace('อำเภอ', '').trim();
        station = this.policeStationsList.find((s: any) => 
          s.ORGANIZE_NAME_THA?.includes(cleanDistName) && 
          (s.ORGANIZE_ADDRESS_PROVINCE == provinceId || s.PROVINCE_ID == provinceId)
        );
      }
    }

    if (station) {
      target[mapping.stationId] = station.ORGANIZE_ID;
      target[mapping.stationName] = station.ORGANIZE_ABBR_THA || station.ORGANIZE_NAME_THA;
      
      this.stations[type] = station;
      this.onStationSelected.emit(this.stations);
    } else {
      target[mapping.stationId] = null;
      target[mapping.stationName] = 'ไม่พบข้อมูลสถานีที่ดูแลพื้นที่นี้';
      this.stations[type] = null;
      this.onStationSelected.emit(this.stations);
    }
    this.syncToFormData(type);
  }

  onSubDistrictChange(type: string, event: any, skipGeocode: boolean = false) {
    const subDistrictId = event.value;
    if (!subDistrictId) return;

    // Automatically skip geocode if the change wasn't triggered by a user DOM event
    if (event.event === undefined) {
      skipGeocode = true;
    }

    const target = (this as any)[type];
    const mapping = this.locationMappings[type];

    target[mapping.subDistrictId] = subDistrictId;
    
    // Map Sub-District Name
    const sd = this.subDistrictsList[type].find((s: any) => s.SUB_DISTRICT_ID === subDistrictId);
    if (sd) {
      target[mapping.subDistrictName] = sd.SUB_DISTRICT_NAME_THA;
    }

    this.subDistrictService.GetPostCode(subDistrictId).subscribe(res => {
      const data = res;
      const codes = Array.isArray(data) ? data : [data];
      this.postcodesList[type] = codes;
      console.log('Postcodes for ' + type + ':', codes);
      if (codes.length > 0) {
        const item = codes[0] as any;
        const pc = item?.POSTCODE_CODE || item?.POSTCODE || (typeof item === 'string' ? item : '');
        target[mapping.postcode] = pc;
      }
      this.syncToFormData(type);

      // Note: Coordinate-based station lookup from dropdown selection was removed
      // to conserve Google Maps geocoding API quota.
      // Police station matching will now rely on district-level matching
      // from onDistrictChange(), or exact GeoJSON matching when users 
      // explicitly click/pin a location on the map.

    });
  }

  ngAfterViewInit(): void {
    const defaultPos = { lat: this.lat, lng: this.lng };
    this.googleMapsService.initMap(this.mapContainer.nativeElement, defaultPos).subscribe(() => {
      this.googleMapsService.loadGeoJson('assets/map/ขอบเขต สน..geojson');
      this.googleMapsService.onMapClick((lat, lng) => {
        this.lat = lat;
        this.lng = lng;
        this.onReverseGeocode();
      });
    });
  }

  onGeocode() {
    if (!this.address) return;
    
    this.loading = true;
    this.error = null;
    this.results = [];
    
    this.googleMapsService.geocode(this.address).subscribe(
      (results) => {
        this.results = results;
        if (results.length > 0) {
          const loc = results[0].geometry.location;
          this.lat = loc.lat();
          this.lng = loc.lng();
          this.googleMapsService.setMarkerPosition(this.lat, this.lng);
          this.parseAddressComponents(results[0].address_components);
        }
        this.loading = false;
      },
      (err) => {
        this.error = 'ไม่พบข้อมูลที่อยู่นี้ หรือ API Key ไม่ถูกต้อง';
        this.loading = false;
        console.error(err);
      }
    );
  }

  onReverseGeocode() {
    if (this.lat === null || this.lng === null) return;

    this.loading = true;
    this.error = null;
    this.results = [];

    this.googleMapsService.reverseGeocode(this.lat, this.lng).subscribe(
      (results) => {
        this.results = results;
        if (results.length > 0) {
          this.address = results[0].formatted_address;
          this.googleMapsService.setMarkerPosition(this.lat, this.lng);
          this.parseAddressComponents(results[0].address_components);
        }
        this.loading = false;
      },
      (err) => {
        this.error = 'ไม่สามารถดึงข้อมูลที่อยู่จากพิกัดนี้ได้';
        this.loading = false;
        console.error(err);
      }
    );
  }

  selectResult(result: google.maps.GeocoderResult) {
    const loc = result.geometry.location;
    this.lat = loc.lat();
    this.lng = loc.lng();
    this.address = result.formatted_address;
    this.googleMapsService.setMarkerPosition(this.lat, this.lng);
    this.parseAddressComponents(result.address_components);
  }

  parseAddressComponents(components: google.maps.GeocoderAddressComponent[]) {
    this.subDistrict = '';
    this.district = '';
    this.province = '';
    this.postcode = '';

    let tempProv = '';
    let tempDist = '';
    let tempSubDist = '';

    components.forEach(comp => {
      const types = comp.types;
      const name = comp.long_name;

      if (types.includes('administrative_area_level_1')) {
        tempProv = name;
      }
      if (types.includes('administrative_area_level_2')) {
        tempDist = name;
      }
      if (types.includes('administrative_area_level_3')) {
        tempSubDist = name;
      }
      if (types.includes('locality')) {
        // Fallback for district if empty
        if (!tempDist) tempDist = name;
      }

      if (types.includes('sublocality_level_1')) {
        if (tempProv.includes('กรุงเทพ') || name.includes('เขต')) {
          // In Bangkok, level_1 is Khet (District)
          tempDist = name;
        } else {
          // Outside Bangkok, level_1 is Tambon (Sub-district)
          tempSubDist = name;
        }
      }
      if (types.includes('sublocality_level_2')) {
        if (tempProv.includes('กรุงเทพ') || name.includes('แขวง')) {
          // In Bangkok, level_2 is Khwaeng (Sub-district)
          tempSubDist = name;
        }
        // Outside Bangkok, level_2 is usually Moo (Village), do not overwrite tempSubDist here!
      }

      if (types.includes('postal_code')) {
        this.postcode = name;
      }
    });

    if (tempProv.includes('กรุงเทพ') && !tempDist) {
      // Fallback for BKK if sublocality_level_1 was missing but locality is present
      const locComp = components.find(c => c.types.includes('locality') && c.long_name !== 'กรุงเทพมหานคร');
      if (locComp) tempDist = locComp.long_name;
    }

    if (!tempSubDist) {
      // Only set from generic sublocality if we don't already have one
      const subLoc = components.find(c => c.types.includes('sublocality') && !c.types.includes('sublocality_level_1') && !c.types.includes('sublocality_level_2'));
      if (subLoc) tempSubDist = subLoc.long_name;
    }

    // Ultimate fallback: Extract from the address string itself if Google misses it
    if (!tempSubDist && this.address) {
      const matchSub = this.address.match(/(?:ตำบล|แขวง|ต\.)\s*([ก-๙a-zA-Z0-9]+)/);
      if (matchSub) tempSubDist = matchSub[1];
    }
    if (!tempDist && this.address) {
      const matchDist = this.address.match(/(?:อำเภอ|เขต|อ\.)\s*([ก-๙a-zA-Z0-9]+)/);
      if (matchDist) tempDist = matchDist[1];
    }
    if (!tempProv && this.address) {
      const matchProv = this.address.match(/(?:จังหวัด|จ\.)\s*([ก-๙a-zA-Z0-9]+)/);
      if (matchProv) tempProv = matchProv[1];
    }

    // Clean up keywords so .includes() match database correctly
    this.province = tempProv.replace('จังหวัด', '').replace('จ.', '').trim();
    this.district = tempDist.replace('อำเภอ', '').replace('อ.', '').replace('เขต', '').trim();
    this.subDistrict = tempSubDist.replace('ตำบล', '').replace('ต.', '').replace('แขวง', '').trim();

    // Note: Matching police station by name in summary is omitted 
    // because ORGANIZE_ADDRESS_SUB_DISTRICT is an ID.
    // Station will be shown after using "Fill Location" or manual selection.
    this.policeStation = ''; 
    const geoFeature = this.findStationFromGeoJson(this.lat, this.lng);
    if (geoFeature && geoFeature.properties && geoFeature.properties.Name) {
      this.policeStation = geoFeature.properties.Name;
    } 

    this.fullAddressDetails = {
      subDistrict: this.subDistrict,
      district: this.district,
      province: this.province,
      postcode: this.postcode,
      policeStation: this.policeStation,
      lat: this.lat,
      lng: this.lng
    };

    console.log('Extracted Details:', this.fullAddressDetails);
  }

  fillLocation(type: 'incident' | 'transfer' | 'bankBranch') {
    const target = (this as any)[type];
    const mapping = this.locationMappings[type];

    target[mapping.address] = this.address;

    // --- Automatic Name-to-ID Mapping ---
    if (!this.province) {
      this.syncToFormData(type);
      return;
    }

    // 1. Match Province
    const cProv = this.province.replace(/\s+/g, '');
    const prov = this.provincesList.find(p => {
      if (!p.PROVINCE_NAME_THA) return false;
      const c1 = p.PROVINCE_NAME_THA.replace(/\s+/g, '');
      return c1.includes(cProv) || cProv.includes(c1);
    });

    if (prov) {
      target[mapping.provinceId] = prov.PROVINCE_ID;
      target[mapping.provinceName] = prov.PROVINCE_NAME_THA;
      
      // 2. Load and Match District
      this.provinceService.GetDistrictofProvince(prov.PROVINCE_ID).subscribe(res => {
        const districts = res;
        this.districtsList[type] = districts;
        
        if (this.district) {
          const cDist = this.district.replace(/\s+/g, '');
          const dist = districts.find((d: any) => {
            if (!d.DISTRICT_NAME_THA) return false;
            const c1 = d.DISTRICT_NAME_THA.replace(/\s+/g, '');
            return c1.includes(cDist) || cDist.includes(c1);
          });
          
          if (dist) {
            target[mapping.districtId] = dist.DISTRICT_ID;
            target[mapping.districtName] = dist.DISTRICT_NAME_THA;

            // --- New Form Smart Calculation ---
            const formDamage = JSON.parse(localStorage.getItem('form-damage') || '{}');
            const totalDamage = Number(formDamage?.TotalDamageValue?.toString().replace(/,/g, '') || 0);
            const provinceId = target[mapping.provinceId];
            let targetStation = null;

            if (totalDamage >= 1000000) {
              const ccibMatch = this.provinceResponsibility.find(r => r.province_id == provinceId);
              if (ccibMatch) {
                targetStation = this.policeStationsList.find(s => s.ORGANIZE_ID === ccibMatch.org_id);
              }
            }

            // If not CCIB, try GeoJSON first from the pin location
            if (!targetStation && this.lat && this.lng) {
              const geoFeature = this.findStationFromGeoJson(this.lat, this.lng);
              if (geoFeature && geoFeature.properties && geoFeature.properties.Name) {
                const geoName = geoFeature.properties.Name.replace('ที่ตั้ง ', '').trim();
                const cleanGeoName = geoName.replace('สน.', '').replace('สภ.', '').replace('ส.รฟ.', '').trim();
                targetStation = this.policeStationsList.find((s: any) => 
                  s.ORGANIZE_NAME_THA === geoName || 
                  s.ORGANIZE_ABBR_THA === geoName ||
                  (s.ORGANIZE_NAME_THA && cleanGeoName && s.ORGANIZE_NAME_THA.includes(cleanGeoName))
                );
              }
            }
            
            // Fallback: Use standard local matching by district
            if (!targetStation) {
              targetStation = this.policeStationsList.find((s: any) => 
                (s.ORGANIZE_ADDRESS_DISRICT == dist.DISTRICT_ID || s.ORGANIZE_ADDRESS_DISTRICT == dist.DISTRICT_ID) &&
                (s.ORGANIZE_NAME_THA?.includes('สภ.') || s.ORGANIZE_NAME_THA?.includes('สน.') || s.ORGANIZE_NAME_THA?.includes('สถานีตำรวจ'))
              );
              if (!targetStation) {
                targetStation = this.policeStationsList.find((s: any) => 
                  s.ORGANIZE_ADDRESS_DISRICT == dist.DISTRICT_ID || s.ORGANIZE_ADDRESS_DISTRICT == dist.DISTRICT_ID
                );
              }
              // Fallback String matching for Bangkok and others
              if (!targetStation && target[mapping.districtName]) {
                const cleanDistName = target[mapping.districtName].replace('เขต', '').replace('อำเภอ', '').trim();
                targetStation = this.policeStationsList.find((s: any) => 
                  s.ORGANIZE_NAME_THA?.includes(cleanDistName) && 
                  (s.ORGANIZE_ADDRESS_PROVINCE == provinceId || s.PROVINCE_ID == provinceId)
                );
              }
            }

            if (targetStation) {
              target[mapping.stationId] = targetStation.ORGANIZE_ID;
              target[mapping.stationName] = targetStation.ORGANIZE_ABBR_THA || targetStation.ORGANIZE_NAME_THA;
              
              this.stations[type] = targetStation;
              this.onStationSelected.emit(this.stations);
            } else {
              this.stations[type] = null;
              this.onStationSelected.emit(this.stations);
            }
            
            // 3. Load and Match Sub-District
            this.districtService.GetSubDistrictOfDistrict(dist.DISTRICT_ID).subscribe(res => {
              const subDistricts = res;
              this.subDistrictsList[type] = subDistricts;
              
              if (this.subDistrict) {
                const subDist = subDistricts.find((sd: any) => {
                  if (!sd.SUB_DISTRICT_NAME_THA) return false;
                  const c1 = sd.SUB_DISTRICT_NAME_THA.replace(/\s+/g, '');
                  const c2 = this.subDistrict.replace(/\s+/g, '');
                  return c1.includes(c2) || c2.includes(c1);
                });
                
                if (subDist) {
                  target[mapping.subDistrictId] = subDist.SUB_DISTRICT_ID;
                  target[mapping.subDistrictName] = subDist.SUB_DISTRICT_NAME_THA;
                  // Final step: Trigger Postcode load & sync
                  this.onSubDistrictChange(type, { value: subDist.SUB_DISTRICT_ID }, true);
                } else {
                  this.syncToFormData(type);
                }
              } else {
                this.syncToFormData(type);
              }
            });
          } else {
            this.syncToFormData(type);
          }
        } else {
          this.syncToFormData(type);
        }
      });
    } else {
      this.syncToFormData(type);
    }
  }

  syncToFormData(type: string) {
    if (!this.formData) return;
    const target = (this as any)[type];
    const mapping = this.locationMappings[type];
    
    Object.keys(mapping).forEach(key => {
      const formKey = mapping[key];
      this.formData[formKey] = target[formKey];
    });
    
    console.log(`Synced ${type} to formData:`, this.formData);
  }

  // --- GeoJSON logic --- //
  private isPointInPolygon(point: {lat: number, lng: number}, polygon: number[][][]) {
    const coordinates = polygon[0]; // outer ring
    let x = point.lng, y = point.lat;
    let inside = false;
    for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
        let xi = coordinates[i][0], yi = coordinates[i][1];
        let xj = coordinates[j][0], yj = coordinates[j][1];
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  }

  findStationFromGeoJson(lat: number, lng: number): any {
    if (!this.policeStationGeoJson || !this.policeStationGeoJson.features) return null;
    let point = { lat, lng };

    for (let feature of this.policeStationGeoJson.features) {
      if (!feature.geometry) continue;

      let found = false;
      if (feature.geometry.type === 'Polygon') {
        found = this.isPointInPolygon(point, feature.geometry.coordinates);
      } else if (feature.geometry.type === 'MultiPolygon') {
        for (let poly of feature.geometry.coordinates) {
          if (this.isPointInPolygon(point, poly)) {
            found = true;
            break;
          }
        }
      }

      if (found) {
        return feature;
      }
    }
    return null;
  }
}
