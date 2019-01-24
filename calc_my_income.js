/**
 * author: xuelangcxy
 * date: 2019-1-23
 * name: tax calculator
 */
/**
  * arguments
  * oriIncome: 税前收入
  * threshold: 起征点，北京默认为5000
  * insuranceRate: 五险一金缴纳比例，北京默认为住房公积金(12%)，养老保险(8%)，医疗保险(2%)，失业保险(0.2%)
  * providentRate: 公积金缴纳比例
  * specicalDeduction: 专项扣除费用
  * deductStart: 专项扣除开始月份，默认1月
  * deductEnd: 专项扣除结束月份，默认12月
  */

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const TAX_GRADIENT = [{
  amount: 36000,
  rate: 0.03,
  adjustAmount: 0
}, {
  amount: 144000,
  rate: 0.1,
  adjustAmount: 2520
}, {
  amount: 300000,
  rate: 0.2,
  adjustAmount: 16920
}, {
  amount: 420000,
  rate: 0.25,
  adjustAmount: 31920
}, {
  amount: 660000,
  rate: 0.30,
  adjustAmount: 52920
}, {
  amount: 960000,
  rate: 0.35,
  adjustAmount: 85920
}, {
  amount: 660000,
  rate: 0.45,
  adjustAmount: 181920
}];
const MAX_PROVIDENT = 6096; // 公积金缴纳上限
const MAX_INSURANCE_PROVIT = 25401; // 五险一金缴纳上限 25401

const hasDeduction = (curIndex, deductStart, deductEnd) => (curIndex >= deductStart && curIndex <= deductEnd);
const formatMoney = (money) => parseFloat(money.toFixed(2));

const calcTax = ({ oriIncome, threshold = 5000, insuranceRate = 0.222, providentRate = 0.12, specicalDeduction = 0, deductStart = 0, deductEnd = 11}) => {
  const pivotAmount = Math.min(oriIncome, MAX_INSURANCE_PROVIT);
  const insurance = pivotAmount * insuranceRate;
  const provident = pivotAmount * providentRate * 2;
  const result = [];
  let totalIncome = 0;
  let totalIncomeBeforeTax = 0;
  let totalIncomeAfterTax = 0;
  let totalTax = 0;
  MONTHS.forEach((month, index) => {
    let shouldTaxAmount = oriIncome - insurance;
    let taxRate = 0;
    let tax = 0;
    totalIncome += oriIncome;
    const curIncomeInfo = {};
    if (shouldTaxAmount > threshold) {
      shouldTaxAmount -= threshold;
      if (hasDeduction(index, deductStart, deductEnd)) {
        shouldTaxAmount -= specicalDeduction;
      }
      totalIncomeBeforeTax += shouldTaxAmount;
      // for(let i = TAX_GRADIENT.length - 1; i > 0; i--) {
      for(let i in TAX_GRADIENT) {
        const diff = totalIncomeBeforeTax - TAX_GRADIENT[i].amount;
        if (diff < 0) {
          taxRate = TAX_GRADIENT[i].rate;
          tax = totalIncomeBeforeTax * TAX_GRADIENT[i].rate - totalTax - TAX_GRADIENT[i].adjustAmount;
          totalTax += tax;
          break;
        }
      }
    } else {

    }
    result.push({
      [month]: {
        '税前月收入': oriIncome,
        '起征点': threshold,
        '五险一金': formatMoney(insurance),
        '住房公积金': formatMoney(provident),
        '应纳税所得额': formatMoney(shouldTaxAmount),
        '适用税率': `${taxRate * 100}%`,
        '应缴个人所得税': formatMoney(tax),
        '实际到手收入': formatMoney(oriIncome - insurance - tax)
      }
    });
  })
  return result;
}

console.log(calcTax({
  oriIncome: 30000,
  specicalDeduction: 2000
}));
