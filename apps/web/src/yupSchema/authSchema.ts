import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid format email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{5,})/,
        'The password must be a minimum of 5 characters and must consist of uppercase letters, lowercase letters and numbers.',
      ),
});

export const registerSchema = yup.object().shape({
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    email: yup
      .string()
      .email('Invalid format email')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{5,})/,
        'The password must be a minimum of 5 characters and must consist of uppercase letters, lowercase letters and numbers.',
      ),
});