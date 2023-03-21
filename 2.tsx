import { useState } from "react";

type ValidationRules<T> = {
  [P in keyof T]: (value: T[P]) => boolean;
};

type ValidationResult<T> = {
  [P in keyof T]: {
    valid: boolean;
    error?: string;
  };
};

type Setters<T> = {
  [P in keyof T]: (value: T[P]) => void;
};

type useFormReturnType<T> = [
  T,
  Setters<T>,
  {
    allFieldsValid(): boolean;
    [K: string]: any;
  }
];

function useForm<T extends { [key: string]: any }>(
  initialData: T,
  validationRules: ValidationRules<T>
): useFormReturnType<T> {
  const [data, setData] = useState<T>(initialData);

  const [validationResult, setValidationResult] = useState<ValidationResult<T>>(
    Object.keys(initialData).reduce((acc: any, key: keyof T) => {
      acc[key] = { valid: true };
      return acc;
    }, {} as ValidationResult<T>)
  );

  const setFieldValue = (key: keyof T, value: T[keyof T]) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
    if (validationRules[key](value)) {
      setValidationResult((prevResult) => ({
        ...prevResult,
        [key]: { valid: true }
      }));
    } else {
      setValidationResult((prevResult) => ({
        ...prevResult,
        [key]: { valid: false, error: "Invalid input" }
      }));
    }
  };

  const setters = Object.keys(initialData).reduce((acc: any, key: keyof T) => {
    acc[key] = (value: T[keyof T]) => setFieldValue(key as keyof T, value);
    return acc;
  }, {} as Setters<T>);

  const allFieldsValid = (): boolean =>
    Object.values(validationResult).every((result) => result.valid);

  return [data, setters, { allFieldsValid, ...validationResult }];
}

interface LoginReq {
  account: string;
  pwd: string;
}

export default function App() {
  const validationRule = {
    account: (v: string) => v.length > 8,
    pwd: (v: string) => v.length > 12
  };

  const [loginReq, formSetter, validationResult] = useForm<LoginReq>(
    {
      account: "",
      pwd: ""
    },
    validationRule
  );

  const doSubmit = () => {
    if (validationResult.allFieldsValid()) {
      // send loginReq
      console.log("account: ", loginReq.account);
      console.log("Password: ", loginReq.pwd);
    }
  };

  return (
    <>
      <form>
        <label>Account</label>
        <input
          type="text"
          value={loginReq.account}
          onChange={(event) => formSetter.account(event.target.value)}
        />
        {!validationResult.account.valid && (
          <div className="invalid">{validationResult.account.error}</div>
        )}

        <label>Password</label>
        <input
          type="password"
          value={loginReq.pwd}
          onChange={(event) => formSetter.pwd(event.target.value)}
        />
        {!validationResult.pwd.valid && (
          <div className="invalid">{validationResult.pwd.error}</div>
        )}
        <button onClick={doSubmit}>Submit</button>
      </form>
    </>
  );
}
