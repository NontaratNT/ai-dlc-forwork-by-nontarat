import { EformModuleConfig } from 'eform-share';
import { Config } from 'share-ui';

// export const environment = {
//     production: false,
//     config: {
//         baseConfig: {
//             apiUrl: "http://localhost:14121/api",
//             reportUrl: "",
//             resourceUrl: "http://www.online.ccib.go.th/resource/ccib/",
//             hubUrl: "http://localhost:14121/hub"
//         },
//         eFormHost: "http://localhost:52169/api",
//         recaptcha: {
//             siteKey: "6LfYkEkaAAAAAMGpXixKjWVrYpWDP8AeDMu_dijr",
//             secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
//         }
//     }
// };

export const environment = {
    production: false,
    config: {
        baseConfig: {
            apiUrl: "http://localhost:5244/api",
            reportUrl: "",
            resourceUrl: "http://www.online.ccib.go.th/resource/ccib/",
            resourceUrlAzure: "https://api.thaipoliceonline.com/eformazure/api/resource/download?filePath=",
            hubUrl: "http://localhost:5244/hub",
            urlgdcc:"http://localhost:14121/api",
            // urlgdcceform:"https://officer.thaipoliceonline.com/api/e-form/v1.0",
            urlgdcceform:"http://localhost:52169/api/",
            aiUrl:"https://officeruat.thaipoliceonline.com/api",
            // urlgdcceform:"http://localhost:52169/api"
        },
        apieCCib: "https://officeruat.thaipoliceonline.go.th/api/ccib/v1.0",
        eFormHost: "http://localhost:5243/api",
        recaptcha: {
            siteKey: "6LfYkEkaAAAAAMGpXixKjWVrYpWDP8AeDMu_dijr",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        },
        versionControl: "1.6808.25.1",
        generateKey: "2P%fLStKBCkxG24#qU67HGDpwL2n2mHb",
        googleMapsApiKey: 'AIzaSyCN11r_-PIOjS9GQHJjoH6g2IhsnzyxcMw'
    }
};
