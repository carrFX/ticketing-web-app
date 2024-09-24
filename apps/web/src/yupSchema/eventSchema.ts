import * as yup from 'yup';

export const createEventsSchema = yup.object().shape({
    title: yup
      .string()
      .required('Title is required'),
    description: yup
      .string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(300, 'Description must be less than 300 characters'),
    category: yup
      .string()
      .oneOf(['sport', 'music', 'movie','tour', 'other'], 'Invalid category')
      .required('Category is required'),
    start_date: yup.date()
      .required('End date is required')
      .min(new Date(), 'Start date must be greater than today'),
    end_date: yup.date()
      .required('End date is required')
      .test('is-greater', 'End date must be greater than start date', function (val) {
        return new Date(val) >= new Date(this.parent.start_date);
      }),
    location: yup
      .string()
      .required('Location is required')
});

export const createTicketsSchema = yup.object().shape({
    roleTicket: yup
      .string()
      .required('Role ticket is required'),
    price: yup
      .string()
      .required('Price is required')
      .matches(/^(?=.*^[0-9]+$)/,"The price must be a number"),
    quantity: yup
      .string()
      .required('Quantity is required')
      .matches(/^(?=.*^[0-9]+$)/,"The quantity must be a number")
});