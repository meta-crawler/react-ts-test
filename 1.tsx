import React, { useState, useEffect } from "react";

interface LoadingWrapperProps<T> {
  loadData: () => Promise<T>;
  renderData: (data: T) => JSX.Element;
}

function LoadingWrapper<T>({
  loadData,
  renderData
}: LoadingWrapperProps<T>): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadData()
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loadData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data) {
    return renderData(data);
  }

  return <></>;
}

const api = {
  foo: async () => {
    // Pretend to load some data
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Hello, world!");
      }, 1000);
    });
  },
  bar: async () => {
    // Pretend to load some data
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(42);
      }, 1000);
    });
  }
};

export default function App() {
  return (
    <>
      <LoadingWrapper
        loadData={() => api.foo()}
        renderData={(data: string) => {
          return <div>{data}</div>;
        }}
      />
      <LoadingWrapper
        loadData={() => api.bar()}
        renderData={(data: number) => {
          return <div>{data}</div>;
        }}
      />
    </>
  );
}
