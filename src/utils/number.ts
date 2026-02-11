import Decimal from "decimal.js";

export type FormatOptions = {
  /**
   * separator symbol
   * @default ','
   */
  groupSeparator?: string;
  /**
   * @default true
   */
  needSeperate?: boolean;
  /**
   * @default 3
   */
  groupSize?: number;
  /**
   * how many fraction number. (if there is noting, 0 will be added )
   * @default 2
   */
  maxDecimalCount?: number;
  /**
   * @default 'trim'
   */
  decimalMode?: "fixed" | "trim";
  /**
   * if true, always use shorter expression
   * if set this, only max 1 digit
   */
  useShorterExpression?: boolean;
};

const stringNumberRegex = /(-?)([\d,_]*)\.?(\d*)/;

function toFixed(n: string, maxDecimalCount: number): string {
  return Number(n).toFixed(maxDecimalCount);
}

function trimTailingZero(s: string): string {
  if (!s.includes(".")) return s;
  const match = s.match(stringNumberRegex);
  if (!match) return s;
  const [, sign = "", int = "", dec = ""] = match;
  let cleanedDecimalPart = dec;
  while (cleanedDecimalPart.endsWith("0")) {
    cleanedDecimalPart = cleanedDecimalPart.slice(
      0,
      cleanedDecimalPart.length - 1
    );
  }
  return cleanedDecimalPart
    ? `${sign}${int}.${cleanedDecimalPart}`
    : `${sign}${int}` || "0";
}

function fall(n: any, actions: any[]) {
  return actions.reduce((value, action) => action(value), n);
}

function formatNumber(
  n: number | string | Decimal | null | undefined,
  {
    groupSeparator = ",",
    maxDecimalCount = 2,
    groupSize = 3,
    decimalMode = "fixed",
    needSeperate = true,
    useShorterExpression,
  }: FormatOptions = {}
): string {
  if (n === undefined || n === null) return "0";
  return fall(n, [
    (n: any) => n?.toString() || "",
    (n: string) => toFixed(n, maxDecimalCount),
    (n: string) => (decimalMode === "fixed" ? n : trimTailingZero(n)),
    (str: string) => {
      if (useShorterExpression) {
        const match = str.match(/(-?)(\d*)\.?(\d*)/);
        const [, sign = "", int = "", dec = ""] = match ?? [];
        if (int.length > 3 * 4) {
          return `${sign}${trimTailingZero(
            (Number(int.slice(0, -3 * 4 + 2)) / 100).toFixed(1)
          )}T`;
        } else if (int.length > 3 * 3) {
          return `${sign}${trimTailingZero(
            (Number(int.slice(0, -3 * 3 + 2)) / 100).toFixed(1)
          )}B`;
        } else if (int.length > 3 * 2) {
          return `${sign}${trimTailingZero(
            (Number(int.slice(0, -3 * 2 + 2)) / 100).toFixed(1)
          )}M`;
        } else if (int.length > 3 * 1) {
          return `${sign}${trimTailingZero(
            (Number(int.slice(0, -3 * 1 + 2)) / 100).toFixed(1)
          )}K`;
        } else {
          return dec ? `${sign}${int}.${dec}` : `${sign}${int}`;
        }
      } else if (needSeperate) {
        const match = str.match(/(-?)(\d*)\.?(\d*)/);
        const [, sign = "", int = "", dec = ""] = match ?? [];
        const newIntegerPart = [...(int || "")].reduceRight(
          (acc, cur, idx, strN) => {
            const indexFromRight = strN.length - 1 - idx;
            const shouldAddSeparator =
              indexFromRight !== 0 && indexFromRight % groupSize === 0;
            return cur + (shouldAddSeparator ? groupSeparator : "") + acc;
          },
          ""
        ) as string;
        return dec
          ? `${sign}${newIntegerPart}.${dec}`
          : `${sign}${newIntegerPart}`;
      } else {
        return str;
      }
    },
  ]);
}

export function formatNumberV2(
  value: number | string,
  options: Intl.NumberFormatOptions = {},
  fractionDigits: number = 2
): string {
  if (typeof value === "string") value = Number(value);
  if (typeof value !== "number" || isNaN(value)) return "";
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    compactDisplay: "short",
    ...options,
  }).format(value);
}

export function smNumber(
  value: number,
  threshold = 5,
  minimumSignificantDigits = 2
): string {
  if (value === 0) return "0";
  if (!value) return "-";
  const subs = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
  const [left, right] = value.toFixed(String(value).length).split(".");
  const result = right.match(`^([0]{${threshold},})`);
  if (result) {
    const length = result[0].length;
    const subStr = length.toString().replace(/\d/g, (digit) => subs[+digit]);
    const end = right.slice(length);
    return (left + ".0" + subStr + end)
      .replace(/0+$/, "")
      .substring(0, 4 + minimumSignificantDigits);
  }
  return formatNumberV2(value, {
    minimumSignificantDigits,
    maximumSignificantDigits: 3,
  });
}

export const formatSmartNumber = (
  num: number | string,
  toFixed: number = 2,
  threshold: number = 5
): string => {
  if (!num) return "0";
  if (typeof num === "string") {
    num = Number(num);
  }
  if (num === 0) return "0";
  if (num >= 10000) {
    return parseFloat(num.toFixed(0)).toString();
  } else if (num >= 10) {
    return parseFloat(num.toFixed(1)).toString();
  } else if (num >= 1) {
    return parseFloat(num.toFixed(toFixed)).toString();
  } else {
    const strNum = num.toFixed(20);
    const parts = strNum.split(".");
    if (parts.length < 2) return num.toString();

    const decimalPart = parts[1];
    let zeroCount = 0;
    for (let i = 0; i < decimalPart.length; i++) {
      if (decimalPart[i] === "0") {
        zeroCount++;
      } else {
        break;
      }
    }

    if (zeroCount >= threshold) {
      const significantDigits = decimalPart.substring(zeroCount);
      let formattedSignificantDigits = significantDigits.substring(0, 4);
      // Remove trailing zeros
      formattedSignificantDigits = formattedSignificantDigits.replace(
        /0+$/,
        ""
      );
      const subs = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
      const subStr = zeroCount
        .toString()
        .replace(/\d/g, (digit) => subs[+digit]);
      return `0.0${subStr}${formattedSignificantDigits}`;
    } else {
      const significantDigits = decimalPart.substring(zeroCount);
      let formattedSignificantDigits = significantDigits.substring(0, 4);
      // Remove trailing zeros
      formattedSignificantDigits = formattedSignificantDigits.replace(
        /0+$/,
        ""
      );
      if (zeroCount > 0) {
        return `0.${"0".repeat(zeroCount)}${formattedSignificantDigits}`;
      } else {
        return `0.${formattedSignificantDigits}`;
      }
    }
  }
};

// default using formatNumberShort
export const formatNumberShort = (
  number: number | string | Decimal | null | undefined,
  {
    groupSeparator = ",",
    maxDecimalCount = 2,
    groupSize = 3,
    decimalMode = "trim",
    needSeperate = true,
    useShorterExpression,
  }: FormatOptions = {},
  {
    isShowFormatNumber = true,
    isShowSmNumber = false,
  }: {
    isShowSmNumber?: boolean;
    isShowFormatNumber?: boolean;
  } = {}
) => {
  if (!number) return "0";

  // Handle scientific notation strings
  if (
    typeof number === "string" &&
    (number.includes("e") || number.includes("E"))
  ) {
    try {
      // Convert to regular decimal notation
      const numValue = Number(number);
      if (isNaN(numValue)) {
        return "0";
      }

      // Handle as a regular number
      number = numValue;
    } catch (error) {
      console.error("Error converting scientific notation:", error);
      return "0";
    }
  }

  if (isShowSmNumber && Number(number) < 0.001)
    return smNumber(Number(number), 3);

  if (isShowFormatNumber && Number(number) < 0.1)
    return formatSmartNumber(number.toString(), 2, 5);

  if (number === 0) return "0";

  return formatNumber(formatSmartNumber(number.toString()), {
    groupSeparator,
    maxDecimalCount,
    groupSize,
    decimalMode,
    needSeperate,
    useShorterExpression,
  });
};

import { formatUnits, parseUnits } from "viem";

export const roundAmount = (amount: number, decimals: number) => {
  return Number(amount.toFixed(decimals));
};

export const uiAmountToBigIntAmount = (
  uiAmount: number | string,
  decimals: number
) => {
  if (decimals < 0 || !Number.isInteger(decimals)) {
    throw new Error("Decimals must be a non-negative integer");
  }

  const amount = typeof uiAmount === "number" ? uiAmount : parseFloat(uiAmount);
  if (isNaN(amount) || !isFinite(amount)) {
    throw new Error("Invalid amount value");
  }

  if (amount < 0) {
    throw new Error("Amount cannot be negative");
  }

  return parseUnits(amount.toString(), decimals);
};

export const bigIntAmountToUiAmount = (
  rawAmount: bigint | string,
  decimals: number
) => {
  return formatUnits(BigInt(rawAmount), decimals);
};
