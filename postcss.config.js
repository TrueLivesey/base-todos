// postcss.config.js
export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead'],
    }, // (Опционально) добавляет префиксы для кроссбраузерности
    'postcss-pxtorem': {
      rootValue: 16, // Базовый размер шрифта (1rem = 16px)
      unitPrecision: 5, // Точность дробных чисел в rem
      propList: ['*'], // Свойства, которые должны быть преобразованы (например, ['font', 'margin', 'padding'])
      selectorBlackList: [], // Селекторы, которые нужно исключить
      replace: true, // Заменять px на rem (если false, оставляет px и добавляет rem)
      mediaQuery: false, // Преобразовывать px в медиа-запросах
      minPixelValue: 0, // Минимальное значение px для преобразования
    },

    cssnano: {
      preset: [
        'default',
        {
          cssDeclarationSorter: false, // Полностью отключить сортировку
        },
      ],
    },
  },
};
