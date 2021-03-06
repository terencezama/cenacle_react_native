

//remove that from realmreact xcodeproj
// $(SRCROOT)/../../../../ios/Pods/Headers/Public
// Define your models and their properties
const BookSchema = {
    name: 'Book',
    primaryKey: 'id',
    properties: {
      id:  'string',
      name: 'string',
      ord: 'int',
      version: 'string',
      chaptersCount:'int'
    }
  };
  const ChapterSchema = {
    name: 'Chapter',
    primaryKey: 'id',
    properties: {
      id:     'string',
      data: 'string?',
      bookId: 'string'
      // birthday: 'date',
      // cars:     'Car[]',
      // picture:  'data?' // optional property
    }
  };
  const VerseSchema = {
    name: 'Verse',
    primaryKey: 'id',
    properties: {
      id:     'string',
      data: 'string',
      ord: 'int',
      bookId: 'string',
      chapterId: 'string'
      // birthday: 'date',
      // cars:     'Car[]',
      // picture:  'data?' // optional property
    }
  }
  
  const HistorySchema = {
    name: 'History',
    properties: {
      date: 'date',
      chapterId: 'string',
      title: 'string'
    }
  }
  
  const HighlightSchema = {
    name: 'Highlight',
    primaryKey: 'verseId',
    properties:{
      chapterId: 'string',
      verseId: 'string',
      verseIndex: 'int',
      date: 'date',
      title: 'string',
      data: 'string'
    }
  }
  
  
 export {
    BookSchema,
    ChapterSchema,
    VerseSchema,
    HistorySchema,
    HighlightSchema
 }
  
  