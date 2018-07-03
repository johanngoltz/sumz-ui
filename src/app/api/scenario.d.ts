export class Scenario {
    id: number;
    name: string;
    description: string;
    periods: number;
    
    equityInterestRate: number;
    interestOnLiabilitiesRate: number;
    businessTaxRate: number;
    corporateTaxRate: number;
    solidaryTaxRate: number;
    stochastic: Boolean;

    additionalIncome: AccountingFigure;
    additionalCosts: AccountingFigure;
    investments: AccountingFigure;
    divestments: AccountingFigure;
    depreciation: AccountingFigure;
    revenue: AccountingFigure;
    costOfMaterial: AccountingFigure;
    costOfStaff: AccountingFigure;
    liabilities: AccountingFigure;
    freeCashflows: AccountingFigure;

    companyValueDistribution: DistributedCompanyValue;
    fteValuationResult: { companyValue: number; };
    fcfValuationResult: FcfValuationResult;
    apvValuationResult: ApvValuationResult;
}

export class AccountingFigure {
    isHistoric: Boolean;
    timeSeries: {
        year: number;
        quarter: 1 | 2 | 3 | 4;
        amount: number;
    }[]
}

export class DistributedCompanyValue {
    xValues: number[];
    yValues: number[];
}

export class FcfValuationResult {
    companyValue: number;
    marketValueTotalAssets: number;
    totalLiabilities: number;
}

export class ApvValuationResult extends FcfValuationResult {
    taxShield: number;
    presentValueOfCashflows: number;
}
