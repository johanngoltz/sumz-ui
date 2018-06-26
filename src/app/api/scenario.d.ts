export class Scenario {
    id: number;
    name: string;
    description: string;
    periods: number;
    equityInterest: number;
    outsideCapitalInterest: number;
    corporateTax: number;
    additionalIncome: AccountingFigure;
    additionalCosts: AccountingFigure;
    investments: AccountingFigure;
    divestments: AccountingFigure;
    revenue: AccountingFigure;
    costOfMaterial: AccountingFigure;
    costOfStaff: AccountingFigure;
    liabilities: AccountingFigure;
    interestOnLiabilities: AccountingFigure;
    freeCashFlows: AccountingFigure;
    companyValueDistribution: DistributedCompanyValue[];
    fteValuationResult: { companyValue: number; };
    fcfValuationResult: FcfValuationResult;
    apvValuationResult: ApvValuationResult;
}

export class AccountingFigure {
    isHistoric: Boolean;
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
