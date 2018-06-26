export class Scenario {
    id: number;
    name: string;
    description: string;
    periods: number;
    equityInterest: number;
    outsideCapitalInterest: number;
    corporateTax: number;
    accountingFigures: AccountingFigure[];
    companyValueDistribution: DistributedCompanyValue[];
    fteValuationResult: { companyValue: number; };
    fcfValuationResult: FcfValuationResult;
    apvValuationResult: ApvValuationResult;
}

export class AccountingFigure {
    // TODO: Deutsch lassen oder englisch übersetzen?
    // TODO: Alle Möglichkeiten hinzufügen
    name: "Umlaufvermögen"
        | "";
    historic: Boolean;
    timeSeries: [{
        year: Date;
        quarter: 1 | 2 | 3 | 4;
        amount: number;
    }]
}

export class DistributedCompanyValue {

}

export class FcfValuationResult {

}

export class ApvValuationResult {

}
