const webpack = require('webpack');


const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./config/html-elements-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {

    entry: {
        'polyfills': './src/polyfills.browser.ts',
        'vendor': './src/vendor.browser.ts',
        'main': './src/main.browser.ts'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map'
    },
    resolve: {

        /*
         * An array of extensions that should be used to resolve modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
         */
        extensions: ['', '.ts', '.js', '.css', '.scss', '.json'],

        // Make sure root is src
        root: './src',

        // remove other default values
        modulesDirectories: ['node_modules'],

    },

    /*
     * Options affecting the normal modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

        /*
         * An array of applied pre and post loaders.
         *
         * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
         */
        preLoaders: [
          {
              test: /\.ts$/,
              loader: 'string-replace-loader',
              query: {
                  search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
                  replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
                  flags: 'g'
              },
              include: './src'
          },

        ],

        /*
         * An array of automatically applied loaders.
         *
         * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
         * This means they are not resolved relative to the configuration file.
         *
         * See: http://webpack.github.io/docs/configuration.html#module-loaders
         */
        loaders: [

          /*
           * Typescript loader support for .ts and Angular 2 async routes via .async.ts
           * Replace templateUrl and stylesUrl with require()
           *
           * See: https://github.com/s-panferov/awesome-typescript-loader
           * See: https://github.com/TheLarkInn/angular2-template-loader
           */
          {
              test: /\.ts$/,
              loaders: [
                '@angularclass/hmr-loader',
                'awesome-typescript-loader',
                'angular2-template-loader'
              ],
              exclude: [/\.(spec|e2e)\.ts$/]
          },

          /*
           * Json loader support for *.json files.
           *
           * See: https://github.com/webpack/json-loader
           */
          {
              test: /\.json$/,
              loader: 'json-loader'
          },

          /*
           * to string and css loader support for *.css files
           * Returns file content as string
           *
           */
          {
              test: /\.css$/,
             // loaders: ['to-string-loader', 'css-loader']
              loaders: ['raw-loader']
          },

          {
              test: /\.scss$/,
              loaders: ['raw-loader', 'sass-loader']
          },

          {
              test: /initial\.scss$/,
              loader: ExtractTextPlugin.extract({
                  fallbackLoader: 'style-loader',
                  loader: 'css-loader!sass-loader?sourceMap'
              })
          },

          {
              test: /\.woff(2)?(\?v=.+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },

          {
              test: /\.(ttf|eot|svg)(\?v=.+)?$/, loader: 'file-loader'
          },

          {
              test: /bootstrap\/dist\/js\/umd\//,
              loader: 'imports?jQuery=jquery'
          },

          /* Raw loader support for *.html
           * Returns file content as string
           *
           * See: https://github.com/webpack/raw-loader
           */
          {
              test: /\.html$/,
              loader: 'raw-loader',
              exclude: './src/index.html'
          },

          /* File loader for supporting images, for example, in CSS files.
           */
          {
              test: /\.(jpg|png|gif)$/,
              loader: 'file'
          }
        ],

        postLoaders: [
          {
              test: /\.js$/,
              loader: 'string-replace-loader',
              query: {
                  search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
                  replace: 'var sourceMappingUrl = "";',
                  flags: 'g'
              }
          }
        ]
    },
    /*
     * Add additional plugins to the compiler.
     *
     * See: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [
      new ExtractTextPlugin({ filename: 'initial.css', allChunks: true }),

      new AssetsPlugin({
          path: './dist',
          filename: 'webpack-assets.json',
          prettyPrint: true
      }),

      /*
       * Plugin: ForkCheckerPlugin
       * Description: Do type checking in a separate process, so webpack don't need to wait.
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      new ForkCheckerPlugin(),
      /*
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages.
       * It identifies common modules and put them into a commons chunk.
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      
      //new webpack.optimize.CommonsChunkPlugin({ names: ['vendor','pollyfills'], filename: 'common.bundle.js' }),
     


      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
       */
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
       './src' // location of your src
      ),

      /*
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       *
       * Copies project static assets.
       *
       * See: https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin([{
          from: './src/assets',
          to: 'assets'
      }]),

      /*
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack bundles.
       * This is especially useful for webpack bundles that include a hash in the filename
       * which changes every compilation.
       *
       * See: https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
          template: './src/index.html',
          chunksSortMode: 'dependency'
      }),

      new webpack.ProvidePlugin({
          jQuery: 'jquery',
          'Tether': 'tether',
          'window.Tether': 'tether'
      }),

      /*
       * Plugin: HtmlHeadConfigPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
          headTags: require('./config/head-config.common.js')
      })

    ],
};