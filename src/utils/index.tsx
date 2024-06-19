import { date, object, string } from 'yup';

export const hexToRgba = (hex: string, alpha: number = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

export const getTextColor = (hexcolor: string) => {
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
};

// Yup schema for validation
// Check out https://github.com/jquense/yup for all of the
// awesome stuff you can do with Yup!
export const reminderSchema = object({
    content: string()
        .required('This field is required.')
        .max(30, 'Max. length 30 characters.'),
    date: date().required(),
    time: date().required(),
    city: string().required('This field is required.'),
    color: string().required('This field is required.'),
});
