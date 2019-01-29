import { put, select } from 'redux-saga/effects'
import firebase from 'react-native-firebase';
import { performAction, Types } from '..';
import { BookSchema, ChapterSchema, VerseSchema, HistorySchema, HighlightSchema } from '../../db/schema';
import { update, request } from '../types';
// import {eventChannel,END} from 'redux-saga'

var RNFS = require('react-native-fs');
const Realm = require('realm');
const realmFile = 'default.realm';
const path = `${firebase.storage.Native.DOCUMENT_DIRECTORY_PATH}/${realmFile}`;
const schema = [BookSchema, ChapterSchema, VerseSchema, HistorySchema, HighlightSchema];


const getUi = (state) => state.ui;

export function* bibleDbFileCheck(action) {
    // console.log('action',action);

    const exists = yield RNFS.exists(path);
    console.log('file exists at path', exists);
    if (!exists) {
        const ref = firebase.storage().ref(realmFile);
        try {
            const result = yield ref
                .downloadFile(
                    path
                )
            console.log('result', result);
            yield put(performAction(1, Types.BIBLE_DB_FILE_DOWNLOADED));
        } catch (e) {
            console.log('error', e);
            yield put(performAction(-1, Types.BIBLE_DB_FILE_DOWNLOADED));
        }
    } else {
        // BIBLE_DB_FILE_DOWNLOADED
        yield put(performAction(1, Types.BIBLE_DB_FILE_DOWNLOADED));
    }
}

export function* fetchBibleBooks(action) {
    const { payload } = action;

    try {
        const realm = yield Realm.open({ path, schema });
        let results = undefined;
        if (payload === 0) {
            //traditional
            results = yield realm.objects('Book').sorted('ord');
        } else {
            results = yield realm.objects('Book').sorted('name');
        }
        const resultsLength = results.length;
        let books = [];
        for (let i = 0; i < resultsLength; i++) {
            const book = results[i];
            books.push(book);
        }


        yield put(performAction(books, Types.BIBLE_BOOKS_UPDATE))
        // realm.close();
    } catch (e) {
        console.log('realm error', e);
    }
}

export function* setChapter(action) {
    const { payload: { bookId, chapter } } = action;
    const chapterId = `${bookId}.${chapter}`;
    try {
        const realm = yield Realm.open({ path, schema });
        let results = yield realm.objects('Verse').filtered(`chapterId = "${chapterId}"`).sorted('ord')

        //check if verse is highlighted
        const highlights = yield realm.objects('Highlight').filtered(`chapterId = "${chapterId}"`).sorted('verseIndex')
        let versesHighlighted = results.filter(verse => {
            return highlights.some(highlight => { return highlight.verseId === verse.id })
        }).map(e => {
            return e.id
        })

        results = results.map(e => {
            if (versesHighlighted.indexOf(e.id) !== -1) {
                let n = { ...e };
                n.isHighlighted = true;
                return n;
            }
            return e;
        })

        yield put(performAction(results, update(Types.BIBLE_CHAPTER)))

        let current_book = yield realm.objects('Book').filtered(`id == "${bookId}"`)
        current_book = current_book[0];
        const data = { ...current_book, chapter };

        yield put(performAction(data, update(Types.BIBLE_CURRENT_BOOK)))

    } catch (e) {
        console.log('realm error setChapter', e);
    }
}

export function* nextChapter(action) {
    const ui = yield select(getUi);

    const bookId = ui.bible_current_book.id;
    const chapNumber = ui.bible_current_book.chapter;

    const realm = yield Realm.open({ path, schema })
    let book = yield realm.objects('Book').filtered(`id == "${bookId}"`)
    book = book[0]
    const { chaptersCount } = book;

    if (chapNumber + 1 > chaptersCount) {
        let ord = book.ord + 1;
        if (ord > 66) {
            ord = 1;
        }
        //next book
        book = yield realm.objects('Book').filtered(`ord == "${ord}"`)
        book = book[0]
        yield put(performAction({
            bookId: book.id,
            chapter: 1
        }, request(Types.BIBLE_CHAPTER)))
    } else {

        yield put(performAction({
            bookId,
            chapter: chapNumber + 1
        }, request(Types.BIBLE_CHAPTER)))
    }

}

export function* prevChapter(action) {
    const ui = yield select(getUi);

    const bookId = ui.bible_current_book.id;
    const chapNumber = ui.bible_current_book.chapter;
    const realm = yield Realm.open({ path, schema })
    let book = yield realm.objects('Book').filtered(`id == "${bookId}"`)
    book = book[0]

    if (chapNumber - 1 > 0) {
        yield put(performAction({
            bookId,
            chapter: chapNumber - 1
        }, request(Types.BIBLE_CHAPTER)))
    } else {
        let ord = book.ord - 1;
        if (ord < 1) {
            ord = 66;
        }
        //next book
        book = yield realm.objects('Book').filtered(`ord == "${ord}"`)
        book = book[0]
        const { chaptersCount: lastChapter } = book;
        yield put(performAction({
            bookId: book.id,
            chapter: lastChapter
        }, request(Types.BIBLE_CHAPTER)))
    }
}

export function* _realmHighlightVerses(verses, title) {


    yield new Promise((resolve, reject) => {
        Realm.open({ path, schema }).then(realm => {
            try {
                realm.write(() => {
                    const date = new Date();
                    const versesLength = verses.length;
                    for (let i = 0; i < versesLength; i++) {
                        const verse = verses[i];
                        const { chapterId, data, verseId, verseIndex } = verse;
                        // console.log('verses',verse);
                        realm.create('Highlight', {
                            chapterId,
                            date,
                            verseId,
                            verseIndex,
                            title,
                            data
                        },true)
                    }
                    resolve(1);
                })
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }).catch(e => {
            console.log(e);
            reject(e)
        })
    });
}

export function* _realmUnHighlightVerses(verses) {


    yield new Promise((resolve, reject) => {
        Realm.open({ path, schema }).then(realm => {
            try {
                realm.write(() => {
                    const versesLength = verses.length;
                    for (let i = 0; i < versesLength; i++) {
                        const verse = verses[i];
                        realm.delete(verse);
                    }
                    resolve(1);
                })
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }).catch(e => {
            console.log(e);
            reject(e)
        })
    });
}

export function* _realmUnHighlightVersesIds(verses){
    yield new Promise((resolve, reject) => {
        Realm.open({ path, schema }).then(realm => {
            try {
                realm.write(() => {
                    const versesLength = verses.length;
                    for (let i = 0; i < versesLength; i++) {
                        const verseId = verses[i];
                        // realm.delete(verse);
                        realm.delete(realm.objectForPrimaryKey('Highlight',verseId))
                    }
                    resolve(1);
                })
            } catch (e) {
                console.log(e);
                reject(e);
            }
        }).catch(e => {
            console.log(e);
            reject(e)
        })
    });
}
export function* highlightVerses(action) {
    const { payload: { verses } } = action;
    console.log('highlightVerses', action);

    const ui = yield select(getUi);
    const name = ui.bible_current_book.name;
    const res = yield _realmHighlightVerses(verses, name).next().value;
    console.log('highlightVerses', res);
}

export function* unhighlightVerses(action) {
    const { payload } = action;
    // alert(JSON.stringify(action));
    yield _realmUnHighlightVerses(payload).next();

    yield put(performAction({}, request(Types.BIBLE_HIGHLIGHTS)))


    const ui = yield select(getUi);
    const bookId = ui.bible_current_book.id;
    const chapter = ui.bible_current_book.chapter;
    yield put(performAction({
        bookId,
        chapter
    }, request(Types.BIBLE_CHAPTER)))
}

export function* unhighlightVersesId(action){
    const { payload } = action;
    // alert(JSON.stringify(action));
    yield _realmUnHighlightVersesIds(payload).next();

    yield put(performAction({}, request(Types.BIBLE_HIGHLIGHTS)))


    const ui = yield select(getUi);
    const bookId = ui.bible_current_book.id;
    const chapter = ui.bible_current_book.chapter;
    yield put(performAction({
        bookId,
        chapter
    }, request(Types.BIBLE_CHAPTER)))
}

export function* fetchBibleHighlights(action) {
    const { payload } = action;
    try {
        const realm = yield Realm.open({ path, schema });
        let results = yield realm.objects('Highlight').sorted('date', true);
        const resultsLength = results.length;
        let highlights = [];

        let chapterIds = {};
        for (let i = 0; i < resultsLength; i++) {
            const highlight = results[i];
            // highlights.push(highlight);

            const chapterId = highlight.chapterId;
            if (chapterIds[chapterId]) {
                chapterIds[chapterId].push(highlight);
            } else {
                chapterIds[chapterId] = [highlight];
            }
        }

        for (const key in chapterIds) {
            const verses = chapterIds[key].sort((a, b) => {
                return a.verseIndex > b.verseIndex;
            });
            const versesLength = verses.length;
            let title = `${verses[0].title} ${key.split('.')[1]}:` ;
            let date = verses[0].date;
            let data = '';
            let title_ext = '';

            for (let i = 0; i < versesLength; i++) {
                const verse = verses[i];
                data += verse.data;

                let c_i = verses[i].verseIndex;
                let n_i = i == versesLength - 1 ? null : verses[i + 1].verseIndex;
                let p_i = i == 0 ? null : verses[i - 1].verseIndex;
                if (i === 0) {
                    title_ext += `${c_i}`
                } else if (i == versesLength - 1) {
                    if (c_i - p_i == 1) {
                        title_ext += `-${c_i}`
                    } else {
                        title_ext += `,${c_i}`
                    }
                } else if (c_i - p_i == 1 && n_i - c_i == 1) {
                    //contine
                } else if (c_i - p_i != 1 && n_i - c_i == 1) {
                    //1 3# 4 5 
                    title_ext += `,${c_i}`

                } else if (c_i - p_i != 1 && n_i - c_i != 1) {
                    title_ext += `,${c_i}`
                } else if (c_i - p_i == 1 && n_i - c_i != 1) {
                    title_ext += `-${c_i}`
                }
            }
            title += title_ext

            highlights.push({
                title,
                date,
                data,
                verses,
                title_ext
            })

        }
        // alert(highlights.join(''))


        yield put(performAction(highlights, update(Types.BIBLE_HIGHLIGHTS)))
        // realm.close();
    } catch (e) {
        console.log('realm error', e);
    }
}

