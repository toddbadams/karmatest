(function() {


    angular.module('ls')
        .config(['$mdThemingProvider', configAltTheme]);

    function configAltTheme($mdThemingProvider) {

        // for palettes see:
        // http://www.google.com/design/spec/style/color.html#color-color-palette
        // to construct a theme download the following illustrator file
        // http://material-design.storage.googleapis.com/publish/v_2/material_ext_publish/0B71WflkWs_SAcDhkeFlZbmVJdG8/stickersheet_uielements.ai
        //  $mdThemingProvider.definePalette('white', {
        //      '50': 'fcfcfc',
        //      '100': 'fafafa',
        //      '200': 'F2F3F8',
        //      '300': 'EDEFF4',
        //      '400': 'E1E1E9',
        //      '500': 'DDDEE3',
        //      '600': 'D7DADD',
        //      '700': 'd32f2f',
        //      '800': 'c62828',
        //      '900': 'b71c1c',
        //      'A100': '428bca',
        //       'A200': 'dadada',
        //      'A400': 'ff1744',
        //      'A700': 'd50000',
        //      'contrastDefaultColor': 'light', // must be dark or light
        //      //hues which contrast should be 'dark' by default
        //      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
        //      'contrastLightColors': ['A200', 'A100', '900', '800', '700', '600']
        //  });

        $mdThemingProvider.definePalette('lswarn', {
            '50': 'D2E1EA',
            '100': 'ffcdd2',
            '200': 'ef9a9a',
            '300': 'e57373',
            '400': 'ef5350',
            '500': '4CAF50', // green 500
            '600': 'FDD835', // yellow 600
            '700': '616161', // grey 700
            '800': 'F44336', // red 500
            '900': '565656',
            'A100': 'ff8a80',
            'A200': 'ff5252',
            'A400': 'ff1744',
            'A700': 'd50000',
            'contrastDefaultColor': 'light', // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'
            ],
            'contrastLightColors': undefined // could also specify this if default was 'dark'
        });

        $mdThemingProvider.extendPalette('blue-grey', {
            'A200': 'FF6E40' //deep orange a200
        });

        var f = $mdThemingProvider.theme('alt');

        // dark(isDark)
        //f.dark(true);

        /**
         * hues
         * Google suggests using the 500 colors as the primary colors in your
         * app and the other colors as accents colors.
         * {
              "default": "500",
              "hue-1": "300",
              "hue-2": "800",
              "hue-3": "A100"
            }
         */

        // backgroundColor(paletteName, hues)
        //f.backgroundColor('foo');

        // primaryColor(paletteName, hues)
        f.primaryPalette('blue', {
            "default": "700",
            "hue-1": "600",
            "hue-2": "500",
            "hue-3": "100"
        });

        // warnColor(paletteName, hues)
        f.warnPalette('lswarn', {
            "default": "700",
            "hue-1": "500",
            "hue-2": "600",
            "hue-3": "800"
        });

        // accentColor(paletteName, hues)
        f.accentPalette('blue-grey', {
            "default": "A200",
            "hue-1": "500",
            "hue-2": "200",
            "hue-3": "100"
        });
    }
})();
