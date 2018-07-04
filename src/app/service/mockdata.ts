import { AccountingFigure, Scenario } from '../api/scenario';

export interface AccountingFigures {
    revenue: AccountingFigure;
    additionalIncome: AccountingFigure;
    costOfMaterial: AccountingFigure;
    costOfStaff: AccountingFigure;
    additionalCosts: AccountingFigure;
    divestments: AccountingFigure;
    investments: AccountingFigure;
    liabilities: AccountingFigure;
}

const rawAccountingFigures = {
    revenue: [13634, 12578, 10865, 8967],
    additionalIncome: [1074, 1218, 1719, 722],
    costOfMaterial: [8079, 7337, 4031, 3099],
    costOfStaff: [2035, 1838, 1764, 1476],
    additionalCosts: [2053, 2143, 3955, 2697],
    divestments: [295, 456, 45, 231],
    investments: [347, 21, 454, 655],
    liabilities: [16917, 16069, 15679, 16605],
};
const accountingFigures = Object.entries(rawAccountingFigures).reduce(
    (allFigures, [key, figureSeries]) => {
        // Hab ich schon mal gesagt, dass JS-Datumsobjekte schlimm sind?
        allFigures[key] = figureSeries.reduce(
            (accumulated, figure, index) => {
                const forYear = new Date().getFullYear() - 4 + index;
                accumulated.timeSeries.push(...[1, 2, 3, 4].map(quarter => ({
                    year: forYear,
                    quarter: quarter,
                    amount: figure / 4,
                })));
                return accumulated;
            }, {
                isHistoric: true, timeSeries: [],
            });
        return allFigures;
    }, {} as AccountingFigures);

const valueDistributionProbabilities = [...Array(11).keys()].map(i => 1 / (Math.pow(5 - i, 2) + 1));
export const DEFAULT_MOCK_DATA: Scenario[] = [{
    ...{
        id: 69190,
        name: 'Testszenario',
        description: 'KPMG-geprüfte, garantiert fehlerfreie Unternehmensbewertung',
        corporateTax: 25,
        equityInterest: 4,
        outsideCapitalInterest: 1,
        periods: 4,
        stochastic: true,
        fcfValuationResult: {
            companyValue: 122000,
            marketValueTotalAssets: 55000,
            totalLiabilities: 20000,
        },
        fteValuationResult: { companyValue: 122000 },
        apvValuationResult: {
            companyValue: 122000,
            marketValueTotalAssets: 50000,
            taxShield: 5000,
            totalLiabilities: 20000,
        },
        companyValueDistribution: [...Array(11).keys()].map(i => {
            return {
                num: i + 1,
                rangeMin: i / 5 * 122000,
                rangeMax: (i + 1) / 5 * 122000,
                height: valueDistributionProbabilities[i],
            };
        }),
        freeCashFlows: {} as AccountingFigure,
    },
    ...accountingFigures,
}];
