import React from "react";
import { FormSubmissionStatus } from "utils";

type UseFormLoaderReturnType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const useFormLoader = (formState: FormSubmissionStatus): UseFormLoaderReturnType => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (formState?.success || formState?.error) setLoading(false);
  }, [formState]);

  return [loading, setLoading];
};
