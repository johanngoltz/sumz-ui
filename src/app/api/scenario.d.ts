export class Scenario {
    id: number;
    name: string;
    description: string;
    periods: number;
    equityInterest: number;
    outsideCapitalInterest: number;
    corporateTax: number;
    stochastic: Boolean;
    additionalIncome: AccountingFigure;
    additionalCosts: AccountingFigure;
    investments: AccountingFigure;
    divestments: AccountingFigure;
    revenue: AccountingFigure;
    costOfMaterial: AccountingFigure;
    costOfStaff: AccountingFigure;
    liabilities: AccountingFigure;
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
    num: number;
    rangeMin: number;
    rangeMax: number;
    height: number;
}

export class FcfValuationResult {
    companyValue: number;
    marketValueTotalAssets: number;
    totalLiabilities: number;
}

export class ApvValuationResult extends FcfValuationResult {
    taxShield: number;
}
