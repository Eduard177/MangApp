export const transformHistoryToMangaData = (history: any[]) => {
  //   console.warn(history, 'history transformHistoryToMangaData');
  const newHistor = history.map((item) => ({
    id: item.mangaId,
    attributes: {
      title: {
        en: item.title,
      },
    },
    relationships: item.coverUrl
      ? [
          {
            type: 'cover_art',
            attributes: {
              fileName: item.coverUrl.split('/').pop()?.replace('.256.jpg', ''),
            },
          },
        ]
      : [],
  }));
  //   console.warn(newHistor, 'history transformHistoryToMangaData');
  return newHistor;
};
