export const accountingDataParams = {
    revenue: { displayName: 'Umsatzerlöse', showOnCalculation: true },
    additionalIncome: { displayName: 'Sonstige Erlöse', showOnCalculation: true },
    costOfMaterial: { displayName: 'Materialkosten', showOnCalculation: true },
    costOfStaff: { displayName: 'Personalkosten', showOnCalculation: true },
    additionalCosts: { displayName: 'Sonstige Kosten', showOnCalculation: true },
    investments: { displayName: 'Investitionen', showOnCalculation: true },
    divestments: { displayName: 'Desinvestitionen', showOnCalculation: true },
    freeCashFlows: { displayName: 'Free Cash Flow', showOnCalculation: false },
    liabilities: { displayName: 'Fremdkapital', showOnCalculation: undefined, shiftDeterministic: true },
};

export let environmentParams = {
    equityInterestRate: {},
    interestOnLiabilitiesRate: {},
    businessTaxRate: {},
    corporateTaxRate: {},
    solidaryTaxRate: {},
};
