

export const checkIsArrayNotEmpty = (exp, field1, field2, field3) => {
    if (!field2 && !field3) {
        return !!(exp[field1] && exp[field1].length)
    } else if (!field3) {
        return !!(exp[field1] && exp[field1][field2] && exp[field1][field2].length)
    } else {
        return !!(exp[field1] && exp[field1][field2] && exp[field1][field2] && exp[field1][field2][field3] && exp[field1][field2][field3].length)
    }
}