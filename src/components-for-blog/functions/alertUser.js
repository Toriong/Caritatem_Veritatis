
export const alertUser = errorType => {
    switch (errorType) {
        case 'companyFieldErr':
            alert("Please choose a social media company for one or more of the 'company' fields.");
            break;
        case 'linkErr':
            alert("Enter in a valid link for one or more of the 'link' fields. Please use an 'http' or 'https' protocol and try again.");
            break;
        case 'accountErr':
            alert("Enter in an account or a description for the 'account/description' fields.");
            break;
        case 'companyLinkAndAccountErr':
            alert("You have invalid entries for the following fields: \r\n\r\n -Company\r\nYou have not chosen a social media company for one or more of the 'company' fields. Please choose a social media company.\r\n\r\n-Link\r\nSome of your entries for one or more of the 'link' fields are invalid. Please provide a valid link with an 'http' or an 'https' protocol.\r\n\r\n-Account\r\nSome of your entries for one or more of the 'account/description' fields are invalid. Please enter an account name or a description of your website.\r\n\r\nPlease check your entries and try again.");
            break;
        case 'companyAndLinkErr':
            alert("You have invalid entries for the following fields: \r\n\r\n -Company\r\nYou have not chosen a social media company for one or more of the 'company' fields. Please choose a social media company.\r\n\r\n-Link\r\nSome of your entries for one or more of the 'link' fields are invalid. Please provide a valid link with an 'http' or an 'https' protocol.\r\n\r\nPlease check your entries and try again.");
            break;
        case 'companyAndAccountErr':
            alert("You have invalid entries for the following fields: \r\n\r\n -Company\r\nYou have not chosen a social media company for one or more of the 'company' fields. Please choose a social media company.\r\n\r\n-Account\r\nSome of your entries for one or more of the 'account/description' fields are invalid. Please enter an account name or a description of your website.\r\n\r\nPlease check your entries and try again.");
        case 'accountAndLinkErr':
            alert("You have invalid entries for the following fields:\r\n\r\n-Link\r\nSome of your entries for one or more of the 'link' fields are invalid. Please provide a valid link with an 'http' or an 'https' protocol.\r\n\r\n-Account\r\nSome of your entries for one or more of the 'account/description' fields are invalid. Please enter an account name or a description of your website.\r\n\r\nPlease check your entries and try again.");
            break;
    }
};