export interface OdooResponsValue<T>{
    IsSuccess: boolean;
    StatusCode: number;
    Message:string;
    StatusDateTime: any;
    Value: T[];
}

export interface IPersonal {
    PERSONAL_ID?: number;
    PERSONAL_CODE?: string;
    TITLE_ID?: number;
    PERSONAL_FULL_NAME: string;
    TITLE_NAME: string;
    ORGANIZE_ROOT_ID: number;
    PERSONAL_FNAME_THA?: string;
    PERSONAL_LNAME_THA?: string;
    PERSONAL_START_DATE?: Date;
    PERSONAL_BIRTH_DATE?: Date;
    PERSONAL_LEAVE_DATE?: Date;
    PERSONAL_TYPE_ID?: number;
    POSITION_ID?: number;
    POSITION_NAME?: string;
    POSITION_MNG_ID?: number;
    POSITION_MNG_NAME?: string;
    POSITION_MNG_LEVEL?: number;
    ORG_ID?: number;
    ORG_NAME?: string;
    PERSONAL_TEL_NO?: string;
    PERSONAL_NATIONALITY?: string;
    PERSONAL_RACE?: string;
    PERSONAL_TEL_HOME?: string;
    PERSONAL_TEL_POSITION?: string;
    PERSONAL_ADDRESS_HOME_REGISTER?: string;
    PERSONAL_ACCIDENCE_TEL?: string;
    PERSONAL_STATUS?: string;
    PERSONAL_CITIZEN_NUMBER?: string;
    PERSONAL_ADDRESS?: string;
    PROVINCE_ID?: number;
    DISTICT_ID?: number;
    SUB_DISTICT_ID?: number;
    POSTCODE_ID?: number;
    HOME_REGISTER_PROVINCE_ID?: number;
    HOME_REGISTER_DISTICT_ID?: number;
    HOME_REGISTER_SUB_DISTICT_ID?: number;
    HOME_REGISTER_POST_CODE?: number;
    ACCIDENCE_TEL?: string;
    ACCIDENCE_ADDRESS?: string;
    ACCIDENCE_PROVINCE?: number;
    ACCIDENCE_DISTICT?: number;
    ACCIDENCE_SUB_DISTICT?: number;
    ACCIDENCE_POST_CODE?: number;
    PERSONAL_RELIGION?: string;
    PERSONAL_GENDER?: number;
    PERSONAL_EMAIL?: string;
    PERSONAL_SALARY?: number;
    PERSONAL_WORK_ADDRESS?: string;
    PERSONAL_PICTURE?: string;
    ACCIDENCE_PERSON?: string;
    ACCIDENCE_RELATION?: string;
    RECORD_STATUS?: string;
    USER_NAME?: string;
    HOME_REGISTER_ADDRESS? : string;
    NEW_PASSWORD?: string;
    UPLOAD_PICTURE?: string;
    USER_PICTURE?: string;
    OLD_PASSWORD?: string;
    USER_ID?: number;
    PERSONAL_SIGNATURE_PICTURE?: string;
    ORGANIZE_NAME_THA?: string;
    PERSONAL_PIN_CODE: string;
    PERSONAL_ID_CARD: string;
}

export interface SubmissionMongo {
    backendId: number;
}
