export type PaymentMethod =
  | {
      id: string;
      type: "card";
      brand: string;
      funding: string;
      last4: string;
      expMonth: number;
      expYear: number;
      isDefault: boolean;
    }
  | {
      id: string;
      type: "bank_account";
      bankName: string;
      accountType: string;
      last4: string;
      isDefault: boolean;
    };

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1OqKz2LkdIwHu7ix3qHsYj2d",
    type: "card",
    brand: "visa",
    funding: "debit",
    last4: "4242",
    expMonth: 8,
    expYear: 2027,
    isDefault: true,
  },
  {
    id: "pm_2RtMa5NpfKzJv9ky6sPbLm7g",
    type: "card",
    brand: "mastercard",
    funding: "credit",
    last4: "5555",
    expMonth: 3,
    expYear: 2028,
    isDefault: false,
  },
  {
    id: "ba_1PwXc8MneLjKr4tz9vQdRk6f",
    type: "bank_account",
    bankName: "Chase",
    accountType: "checking",
    last4: "6789",
    isDefault: false,
  },
];