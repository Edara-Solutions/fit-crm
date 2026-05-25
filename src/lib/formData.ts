const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type FormValue = string | number | boolean | null | undefined | File | File[] | string[] | number[] | Array<Record<string, unknown>> | Record<string, unknown>;

export function validateImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed.';
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image files must be 5MB or smaller.';
  }

  return null;
}

export function buildFormData(payload: Record<string, FormValue>) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      if (value.every((item) => item instanceof File)) {
        value.slice(0, key === 'images' ? 8 : value.length).forEach((file) => formData.append(key, file));
        return;
      }

      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          Object.entries(item).forEach(([nestedKey, nestedValue]) => {
            if (nestedValue === undefined || nestedValue === null || nestedValue === '') return;
            formData.append(`${key}[${index}][${nestedKey}]`, String(nestedValue));
          });
          return;
        }

        formData.append(`${key}[]`, String(item));
      });
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedValue === undefined || nestedValue === null || nestedValue === '') return;
        formData.append(`${key}[${nestedKey}]`, String(nestedValue));
      });
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}
