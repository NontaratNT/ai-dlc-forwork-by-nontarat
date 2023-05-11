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
            apiUrl: "http://localhost:14121/api",
            reportUrl: "",
            resourceUrl: "http://www.online.ccib.go.th/resource/ccib/",
            hubUrl: "http://localhost:14121/hub"
        },
        eFormHost: "http://localhost:52169/api",
        recaptcha: {
            siteKey: "6LfYkEkaAAAAAMGpXixKjWVrYpWDP8AeDMu_dijr",
            secretKey: "6LeV1vQcAAAAAJzMmWwJqq76i_fQuflBIF5upGbB"
        }
    }
};
