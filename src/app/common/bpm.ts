export interface IFlowInfo {
    FLOW_ID?: number;
    FLOW_CODE?: string;
    FLOW_NAME?: string;
    WF_DEFINITION_ID?: string;
    RECORD_STATUS?: string;
    DEL_FLAG: string;
    CREATE_DATE: Date | string;
    CREATE_USER_ID: number;
    UPDATE_DATE: Date | string;
    UPDATE_USER_ID: number;
}
