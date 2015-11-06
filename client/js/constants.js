var errors = {
    UNKNOWN: {
        title: "Whoops! Something went wrong.",
        body: "Please check your internet connection and try again."
    },
    WRONG_LOGIN: {
        title: "Whoops! We dont know you.",
        body: "The email/password you entered is incorrect. Please try again."
    },
    UNAUTHORIZED: {
        title: "Whoops! Something went wrong.",
        body: "Sorry! You are not allowed to perform this last action."
    },
    BAD: {
        title: "Whoops! Something went wrong.",
        body: "Looks like some fields are missing or incorrect! Please try again."
    },
    BAD_NAME: {
        title: "Uh Oh! Your name doesn't looks looks right to us!"
    },
    BAD_RESIDENT: {
        title: "Uh Oh! Your resident name doesn't looks right to us!"
    },BAD_RESIDENT_Room: {
        title: "Uh Oh! Your resident name OR room No doesn't looks right to us!"
    },BAD_RESIDENT_Room_company_event: {
        title: "Uh Oh! Your Resident Name or Room No or Company or Event or Purpose of visit doesn't looks right to us!"
    },BAD_whoAreYou: {
        title: "Uh Oh! Who are you visiting doesn't looks right to us!"
    },
    BAD_PHONE: {
        title: "Uh Oh! Your phone No doesn't looks looks right to us!"
    },
    BAD_EMAIL: {
        title: "Uh Oh! Your email doesn't looks looks right to us!"
    },BAD_PHONE_USE: {
        title: "That phone number is in use by someone who has already visited before. Please use 'Returning Visitor' to identify yourself when checking in if this is your phone number."
    },
    BAD_EMAIL_USE: {
        title: "That email is in use by someone who has already visited before. Please use 'Returning Visitor' to identify yourself when checking in if this is your email."
    },BAD_EMAIL_PHONE_USE: {
        title: "That email address / phone number is in use by someone who has already visited before. Please use 'Returning Visitor' to identify yourself when checking in if this is your phone number."
    },
    RELOAD: {
        title: "Looks like this page is outdated, Please refresh and retry!"
    },
    NEW_USER: {
        title: "If you are New User please use the new User button below."
    },
    UNRECOGNIZED_USER: {
        title: "Hi There, we dont recongnize you. Please fill in your details."
    }
};

var searchValidLocations = [
    {name: 'All', value: null},
    {name: 'Spitalfields', value: 'Spitalfields'},
    {name: 'Notting Hill', value: 'Notting Hill'},
    {name: 'King\'s Cross', value: 'Kings Cross'}];

//var locations = ['Spitalfields', 'Notting Hill', 'Kings Cross'];
var locations ;

var types = [
    'Please Select One',
    'Student Visitor',
    'Returning Guest',
    'Event Guest',
    'Family Member',
    'Other Visitor',
    'Business Partner',
    'Student – Other Property'
];
