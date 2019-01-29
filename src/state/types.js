// ####################################################

export const request = (type) => {
    return `${type}_REQUEST`;
}
export const failure = (type) => {
    return `${type}_FAILURE`;
}
export const success = (type) => {
    return `${type}_SUCCESS`;
}

export const update = (type) => {
    return `${type}_UPDATE`;
}
// ####################################################
export const WELCOME = "WELCOME";
export const UPDATE_WELCOME_TEXT = "UPDATE_WELCOME_TEXT";

export const CHECK_USER_LOGGEDIN = "CHECK_USER_LOGGEDIN";
export const UPDATE_USER_LOGGEDIN = "UPDATE_USER_LOGGEDIN";
export const UPDATE_USER = "UPDATE_USER";

export const USER_LOGIN = "USER_LOGIN";
export const USER_REGISTER = "USER_REGISTER";
export const USER_FORGOTPASSWORD = "USER_FORGOTPASSWORD";
export const USER_LOGOUT = "USER_LOGOUT";

export const BIBLE_CHECK_DB_FILE = "bible_check_database_file";
export const BIBLE_DB_FILE_DOWNLOADED = "BIBLE_DB_FILE_DOWNLOADED";
export const BIBLE_BOOKS_REQUEST = "BIBLE_BOOKS_REQUEST";
export const BIBLE_BOOKS_UPDATE = "BIBLE_BOOKS_UPDATE";
export const BIBLE_INC_FONTSIZE = "BIBLE_INC_FONTSIZE";
export const BIBLE_DEC_FONTSIZE = "BIBLE_DEC_FONTSIZE";
export const BIBLE_NEXT_CHAPTER = "BIBLE_NEXT_CHAPTER";
export const BIBLE_PREV_CHAPTER = "BIBLE_PREV_CHAPTER";
export const BIBLE_UNDERLINE = "BIBLE_UNDERLINE";
export const BIBLE_HIGHLIGHT_VERSES = "BIBLE_HIGHLIGHT_VERSES";
export const BIBLE_UNHIGHLIGHT_VERSES = "BIBLE_UNHIGHLIGHT_VERSES";
export const BIBLE_UNHIGHLIGHT_VERSES_IDS = "BIBLE_UNHIGHLIGHT_VERSES_IDS";
export const BIBLE_AUDIO_TOGGLE = "BIBLE_AUDIO_TOGGLE";
export const BIBLE_CHAPTER_HAZARD = "BIBLE_CHAPTER_HAZARD";


export const BIBLE_CHAPTER = "BIBLE_CHAPTER";
export const BIBLE_CURRENT_BOOK = "BIBLE_CURRENT_BOOK";

export const EVENTS = "EVENTS";
export const SHARES = "SHARES";
export const SUMMARIES = "SUMMARIES";
export const BIBLE_HIGHLIGHTS = "BIBLE_HIGHLIGHTS";

export const YOUTUBE_VIDEOS = "YOUTUBE_VIDEOS";